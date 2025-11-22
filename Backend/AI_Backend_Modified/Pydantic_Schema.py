from pydantic import BaseModel, Field


class PageAnalysis(BaseModel):
    """Structured output when navigating or explaining a webpage."""
    
    best_url: str = Field(
        None,
        description="The single most relevant URL chosen after evaluation."
    )
    description: str = Field(
        None,
        description="Short and simple explanation of what this page is about (plain English)."
    )
    response: str = Field(
        ...,
        description="Agent's final spoken output to the user."
    )

