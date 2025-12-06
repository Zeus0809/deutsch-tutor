from mlx_lm import generate, load
from huggingface_hub import snapshot_download
from pathlib import Path

MODEL_REPO = "Qwen/Qwen3-8B-MLX-4bit"
MODEL_PATH = None
MODEL = None
TOKENIZER = None

def download():
    """Pulls a model repo from HF using huggingface-hub"""
    global MODEL_PATH
    if MODEL_PATH is not None and Path(MODEL_PATH).exists():
        print("## LLM already exists at ", MODEL_PATH, " ##")
    else:
        MODEL_PATH = Path(snapshot_download(repo_id=MODEL_REPO))
        print("## LLM pulled successfully, saved at ", MODEL_PATH, " ##")

def init():
    global MODEL, TOKENIZER
    MODEL, TOKENIZER = load(MODEL_PATH.as_posix(), lazy=True)
    if MODEL != None and TOKENIZER != None:
        print("## LLM loaded successfully ##")
    else:
        print("## Error loading the LLM ##")

def chat(prompt: str) -> None:

    print("\nUser said: ", prompt, "\n")

    messages = [{"role": "user", "content": prompt}]
    prompt = TOKENIZER.apply_chat_template(
        messages, add_generation_prompt=True
    )

    response = generate(MODEL, TOKENIZER, prompt=prompt, verbose=True)

