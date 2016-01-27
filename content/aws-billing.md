Title: Parsing AWS billing
Date: 2016-01-23 12:00
Category: FOSS
Tags: AWS, Billing, Scripts, Python
Slugs: aws-billing

## The Story
I never understood the AWS billing very well and happily left it to my CTO.  
A couple of days ago, however, my CTO secretly told me he's mainly interested in learning 2 things from those bills:

1. How much are we paying for every component of the application?
2. How much are we paying for every type of AWS service?

With that knowledge came the task of helping him extract that information from the billing statements.  
Being a strong believer in self-service, I crafted some scripts to generate a CSV to answer both questions (and possible intersections, which are also interesting).

## Some prepwork
1. Make sure your different AWS resources (EC2 VMs, S3 buckets, CloudFront distributions...) are tagged with the same tag, describing their "applicative" component (e.g. `Component: FrontEnd-PHP`). This tag will help us aggregate the lines in the detailed AWS billing reports (see below)
2. Include this tag under ["Cost Allocation Tags"](https://console.aws.amazon.com/billing/home?region=us-east-1#/preferences/tags)
3. Using the [preferences page](https://console.aws.amazon.com/billing/home?region=us-east-1#/preferences), set up a bucket and enable "Cost allocation report" (contains billing with our selected tags) and "Detailed billing report" (contains billing per resource). We'll use these reports as our data source

## Pivoting
### Abstract
If you take a look at the "Cost allocation report" (`aaaaaaaaaaaa-aws-cost-allocation-yyyy-mm.csv`), you'll find these columns that are of interest:

* "user:TAGNAME", correlating with the tag we chose earlier (e.g. `user:Component`)
* "UsageType", succinctly describing the type of usage (e.g. "EU-SAE1-AWS-In-Bytes")
* "TotalCost", containing the cost (in USD for me) of that usage of that resource

[Pivoting](https://en.wikipedia.org/wiki/Pivot_table) these columns should give me a matrix I can pass the executives. I chose this form:  
```text
| \              | UsageType     |
| user:Component | sum:TotalCost |
```
So the columns will be the different usage types, the rows will be the different components, and the values will be the cost of this specific combination (the "sum" is just a formality, since every combination should appear only once).

### Scripting
One can do that pivot manually (using LibreOffice Calc / Microsoft Excel, for instance), but I like scripts.  
I chose to use the Pandas library in Python because it's built for stuff like this (I believe a vanilla Python solution is possible but will take more time).  
This is a basic script for pivoting our data:
```python
import pandas
import numpy
tag_name='user:Component'
raw = pandas.read_csv('COST_ALOCATION.csv', skiprows=1) # First row is some warning about tags not included by default
raw['UsageType'].fillna('???',inplace=True)
raw[tag_name].fillna('???',inplace=True)
pivot = raw.pivot_table(rows=[tag_name], cols=['UsageType'], values=['TotalCost'], aggfunc=numpy.sum, margins=True)
# for newer versions of pandas: raw.pivot_table(index=[tag_name], columns=['UsageType'], values=['TotalCost'], aggfunc=numpy.sum, margins=True)
pivot.to_csv('OUT_FILE.csv')
```

#### Things to note
* I'm using `fillna` to replace "empty" items in selected columns (e.g. lines with the component tag empty) with "???". This is important as Pandas discards such rows, but still includes them for its subtotals
* Using `numpy.sum` is somehow better than using `sum` as an aggregator. If I don't use it, I don't get a grand total

## Drilldown
Say you have a cell that costs you more than you think is proper (for instance, "queue-manager"/"EU-SAE1-AWS-In-Bytes") and you want to analyze it.  
The "Detailed billing report with resources and tags" (`aaaaaaaaaaaa-aws-billing-detailed-line-items-with-resources-and-tags-yyyy-mm.csv.zip`), which is also located in our billing bucket (although zipped) contains the billing at an item-level detail, along with our tags.  
You can try analyzing this report manually (e.g. using Excel), but since it's a huge file it will take some time.  
Using the same library, this is how we extract the values for a specific pivot cell (Component/Usage combination):

```python
import pandas
tag_name='user:Component'
tag_value='ExpensiveComonent'
usage_value='ExpensiveUsage'
raw = pandas.read_csv('DETAILED.csv')
filtered = raw.loc[raw[tag_name]==tag_value][[tag_name,'ResourceId','UsageType','Cost']]

# Optionally filter by non-zero costs
filtered = filtered.loc[filtered['Cost'] > 0]

filtered.to_csv('OUT_FILE.csv')
```

## Other sugggestions
These are some other reports I did that might be interesting

* Pivot by resource id / usage type in a specific component:

        :::python
        import pandas
        import numpy
        tag_name='user:Component'
        tag_value='ExpensiveComonent'

        raw = pandas.read_csv('DETAILED.csv')
        filtered = raw.loc[raw[tag_name]==tag_value][['ResourceId','UsageType','Cost']]
        filtered['ResourceId'].fillna('???',inplace=True)
        pivot = filtered.pivot_table(rows=['ResourceId'], cols=['UsageType'], values=['Cost'], aggfunc=numpy.sum, margins=True) # Newer pandas - see above
        pivot.to_csv('OUT_FILE.csv')

* Pivot component/usage type, use regex to select usage type, only show cells that cost money, and show Usage amount instead of cost

        :::python
        import pandas
        import numpy
        tag_name='user:Component'
        usage_regex='.*-Out-Bytes$'

        raw = pandas.read_csv('COST_ALOCATION.csv', skiprows=1)
        raw_nonna = raw.dropna(subset=['UsageType']) # Drop lines without usage type
        filtered = raw_nonna.loc[raw_nonna['UsageType'].str.match(usage_regex)]
        filtered[tag_name].fillna('???',inplace=True)
        filtered = filtered.loc[filtered['Cost'] > 0]
        pivot = filtered.pivot_table(rows=[tag_name], cols=['UsageType','Rate'], values=['UsageQuantity'], aggfunc=numpy.sum, margins=True) #TODO complete
        pivot.to_csv('OUT_FILE.csv')

