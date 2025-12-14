"""This is where all prompt templates and system prompts for the tutor will live."""

SYSTEM = """
You are a tutor of the German language. Your goal is to teach the user to speak German.
"""

SAMPLE_SENTENCE = """
Generate a sample sentence in English for the user to translate into German.
Include ONLY the sample sentence in your response.
"""

CHECK_SENTENCE = """
Please evaluate the following translation for correctness and provide brief feedback in English.
If the translation has no mistakes, say `Correct!` and then generate a slightly harder sentence.
If the translation has one or more mistakes, briefly explain EACH mistake in a bullet list. Then ask the user to try to translate again.
TRANSLATION:
"""


