from firecrawl import Firecrawl
from agents import function_tool

class customFirecrawl:
    def __init__(self,api_key):
        self.api_key=api_key
        self.fircrawl_init=Firecrawl(self.api_key)


firecrawl_colleciton=customFirecrawl(api_key="your-api-key")


@function_tool
async def crawling_tool(search_query:str):
     return firecrawl_colleciton.fircrawl_init.search(search_query, limit=1).web.url
 
if __name__=='__main__':
    results=firecrawl_colleciton.fircrawl_init.search(query="cough & cold related blogs from parentune", limit=1).web[0].url
    print(results)