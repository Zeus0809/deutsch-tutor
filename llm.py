from mlx_lm import load, generate

MODEL_REPO = "Qwen/Qwen3-8B-MLX-8bit"

def chat(prompt: str) -> None:

    print("\nUser said: ", prompt, "\n")

    model, tokenizer = load(MODEL_REPO, lazy=True)

    messages = [{"role": "user", "content": prompt}]
    prompt = tokenizer.apply_chat_template(
        messages, add_generation_prompt=True
    )

    response = generate(model, tokenizer, prompt=prompt, verbose=True)

    print("\nAI said: ", response, "\n")

