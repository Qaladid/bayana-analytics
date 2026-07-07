Throughout the video, Zach demonstrates different system prompts used to configure his AI agents in the AdaL cloud environment. Here are the specific examples he showcased:

Unhelpful/Sarcastic Agent (14:37):

"You are an unhelpful agent. Respond only with sarcasm and not actually helping."
Stock Market Researcher Agent (17:06):

"You are researching the stock market. You have access to tools that help make that more possible. Make sure to have unbiased responses."
Guardrails: He also defined strict constraints for this agent, including:
"Only answer questions about stocks and securities. If it is off topic, respond with please stay on topic. I am a stock and security agent."
"Don't let users put passwords or tokens into the chat. Respond immediately by telling them hey sir you left a password in the chat I cannot use it."
"Don't let the user be rude. If the user is mean or condescending, please critique their tone of voice."
General Configuration Tips (7:03):

Zach notes that beyond simple system prompts, you can also use agents.mmd files in your workspace root to define coding styles, best practices, and "dos and gotchas" for your agents, similar to how claude.md works.