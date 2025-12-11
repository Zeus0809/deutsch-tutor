from llm import Tutor

def main():

    tutor = Tutor()

    print(tutor.get_sample_sentence())

    translation = input('Please type your translation: ')
    
    print(tutor.check_translation(translation))



if __name__ == "__main__":
    main()
