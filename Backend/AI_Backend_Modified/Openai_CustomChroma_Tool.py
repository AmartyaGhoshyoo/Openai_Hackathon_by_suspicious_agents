from agents import function_tool
from AI_Moves_Chatbot.Database import AsyncChromaDB
import asyncio
async def client_collection(collection_name:str):
    client=AsyncChromaDB(collection_name,no_results=1)
    await client.client_init_async()
    return client.collection


collection=asyncio.run(client_collection('urls_merged'))

# ====================================
# For Testing Purposes in local starts
# ====================================
async def search_internal_urls_test(search_query:str):
    results=await collection.query(search_query)
    top_metadata = results['metadatas'][0][0]
    return {
            'best_url':top_metadata['url'],
            'description': top_metadata['description']
        }
# ====================================
# For Testing Purposes in local ends
# ==================================== 
   
@function_tool
async def search_internal_urls(search_query:str):
    results=await collection.query(search_query)
    top_metadata = results['metadatas'][0][0]
    return {
            'best_url':top_metadata['url'],
            'description': top_metadata['description']
        }
    
    
if __name__=='__main__':
    result=asyncio.run(search_internal_urls_test('Api Quickstart'))
    print(result)
    