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
If the translation is 100 percent correct, say that and nothing else.
If the translation has one or more mistakes, briefly explain EACH mistake in a bullet list.
TRANSLATION:
"""


