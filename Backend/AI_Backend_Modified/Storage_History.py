from agents.extensions.memory.sqlalchemy_session import SQLAlchemySession
from sqlalchemy.ext.asyncio import create_async_engine
from agents import SQLiteSession
from crewai.utilities.paths import db_storage_path
import os
from pathlib import Path
from uuid import uuid4
# unique_id=uuid4()
engine = create_async_engine(
        "postgresql+asyncpg://agentuser:agentpass@localhost:5432/agents"
    )
project_root = Path(__file__).parent
db_dir = project_root / 'User_Sessions_Directory'
os.makedirs(db_dir, exist_ok=True)
async def set_db_name(db_name:str='Guest'):
    # project_root = Path(__file__).parent
    # storage_dir = project_root / f"{db_name}_parentune"
    # os.environ["CREWAI_STORAGE_DIR"] = str(storage_dir)
    # session=SQLiteSession(f'{db_name}',f'Project_Directory/User_Sessions_Directory/{db_name}.db')

    session = SQLAlchemySession(
        f'{db_name}',
        engine=engine,
        create_tables=True,
    )
    
    # Get the base storage path
    # storage_path = db_storage_path()
    # print(f"CrewAI storage location: {storage_path}")

    # # List all CrewAI storage directories
    # if os.path.exists(storage_path):
    #     print("\nStored files and directories:")
    #     for item in os.listdir(storage_path):
    #         item_path = os.path.join(storage_path, item)
    #         if os.path.isdir(item_path):
    #             print(f"📁 {item}/")
    #             # Show ChromaDB collections
    #             if os.path.exists(item_path):
    #                 for subitem in os.listdir(item_path):
    #                     print(f"   └── {subitem}")
    #         else:
    #             print(f"📄 {item}")
    # else:
    #     print("No CrewAI storage directory found yet.")
        
    return session