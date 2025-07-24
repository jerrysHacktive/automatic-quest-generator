This tool is a continuation of the effort to streamline quest creation, creating an interactive program that takes a location name as input and uses multiple sources/APIs to collect information - and outputs a new quest, using only 3 sources for information:
OpenTripMap API ( OpenTripMap API)
Flickr API ( Flickr Services)
An LLM API ( cheahjs/free-llm-api-resources)
The program will take in a location name, and use OpenTripMap to search for matching locations. The program should then show every fetched location as a list - and prompt the user to select one. Once selected, the program should begin compiling that information into a quest object, which should have the following rows:
Title
Aura
Category
Description
Latitude
Longitude
Price
Images.
This tool is a CLI application.
