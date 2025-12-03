from llm import chat

def main():
    prompt = input('Ask me anything: [q to quit]')
    while prompt != "q":
        chat(prompt)
        prompt = input('Ask me anything: [q to quit]')




if __name__ == "__main__":
    main()
