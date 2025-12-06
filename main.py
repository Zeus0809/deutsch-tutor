import llm

def main():

    llm.download()
    llm.init()

    prompt = input('Ask me anything: [q to quit]')
    while prompt != "q":
        llm.chat(prompt)
        prompt = input('Ask me anything: [q to quit]')



if __name__ == "__main__":
    main()
