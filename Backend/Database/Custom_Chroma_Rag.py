import pandas as pd
import chromadb
import uuid
from typing import List

from chromadb.utils.embedding_functions import OpenAIEmbeddingFunction
def to_int(value):
    # Remove commas, spaces, and handle empty strings safely
    value = str(value).replace(",", "").strip()
    return int(value) if value.isdigit() else None

class AsyncChromaDB:
    def __init__(
        self,
        collection_name: str = "Default",
        host="localhost",
        port=5000,
        no_results: int = 10,
    ):
        self.host = host
        self.port = port
        self.client = None
        self.collection = None
        self.n_results = no_results
        self.collection_name = collection_name
        # self.client_init_async() I Can't directly call this as constructor doesn't support

    async def client_init_async(self):
        self.client = await chromadb.AsyncHttpClient(self.host, self.port)
        if self.collection_name != "Default":
            self.collection = await self.client.get_or_create_collection(
                name=self.collection_name,
                embedding_function=OpenAIEmbeddingFunction(
                    model_name="text-embedding-3-small"
                ),
            )

    async def client_add(
        self, documents: List[str], metadatas: List[dict], ids: List[str]
    ):
        if not self.collection:
            raise RuntimeError("Collection not initialized")
        await self.collection.add(documents=documents, metadatas=metadatas, ids=ids)
        print("✅ Data Added Successfull")

    async def client_query(self, user_query: str):
        if not self.collection:
            raise RuntimeError("Collection not initialized")
        results = await self.collection.query(
            query_texts=[user_query],
            n_results=self.n_results,
            include=["metadatas", "documents", "distances"],
        )
        return results


class addDocuments(AsyncChromaDB):
    def __init__(
        self,
        csv_file_path,
        collection_name="Default",
        host="localhost",
        port=5000,
        no_results=10,
    ):
        super().__init__(collection_name, host, port, no_results)
        self.csv_file = csv_file_path

    @classmethod
    async def create(
        cls,
        csv_file_path,
        collection_name="Default",
        host="localhost",
        port=5000,
        no_results=10,
    ):
        self = cls(csv_file_path, collection_name, host, port, no_results)
        await self.adding_documents()
        return self

    async def adding_documents(self):
        df = pd.read_csv(self.csv_file)
        documents = []
        metadatas = []
        ids = []
        for _,row in df.iterrows():
            description=str(row['description'])
            metadata={
                'best_url':row['url'],
                'description': row['description']
            }
            documents.append(description)
            metadatas.append(metadata)
            ids.append(str(uuid.uuid4()))
        await self.client_init_async()
        await self.client_add(documents, metadatas, ids)


        print("✅ All documents added safely to Chroma")



# ====================
# For Local storing
# ====================
def client_init_persistent():
    client = chromadb.PersistentClient(path="IR/chroma_db")
    collection_name = "qa_collection"
    collection = client.get_or_create_collection(name=collection_name)
    return collection, collection_name


if __name__ == "__main__":

    async def main():
        df = pd.read_csv("IR/query_CUM_expert_id.csv")
        documents = []
        metadatas = []
        ids = []

        for _, row in df.iterrows():
            question = str(row["question"])  # document text
            metadata = {
                "answer": str(row["answer"]),
                "expert_id": str(row["expert_id"]),
            }
            documents.append(question)
            metadatas.append(metadata)
            ids.append(str(uuid.uuid4()))
        async_test = AsyncChromaDB("IR_Fallback_Test")
        await async_test.client_init_async()
        await async_test.client_add(documents, metadatas, ids)
        # collection,collection_name=client_init_persistent()
        # collection.add(
        #     documents=documents,
        #     metadatas=metadatas,
        #     ids=ids
        # )
        # print(f"✅ Added {len(documents)} questions to ChromaDB collection '{collection_name}'")
        user_query = "my 2.3yr child can drink milk with sugar and without sugar also. someone told me not to add sugar to her milk. can we give it or not"  # example query
        result = await async_test.client_query(user_query)
        # results = collection.query(
        #     query_texts=[user_query],
        #     n_results=1  # get top 1 match
        # )

        # Step 6: Extract and display results
        top_doc = result["documents"][0][0]
        top_metadata = result["metadatas"][0][0]

        print("\n🔍 Top Similar Question:", top_doc)
        print("💬 Answer:", top_metadata["answer"])
        print("👨‍⚕️ Expert ID:", top_metadata["expert_id"])


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
