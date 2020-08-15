from pydantic import BaseModel

class ComputingRequest(BaseModel):
    actor: str
    provider: float

