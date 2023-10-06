import requests
from bs4 import BeautifulSoup
import json
from random import randint

with open('meetup.html', encoding='utf-8') as html_file:

    soup = BeautifulSoup(html_file, 'html.parser')
    data = []
    for event in soup.find_all(attrs={'data-testid': 'categoryResults-eventCard'}):        

        event_time = event.find('time')['datetime']
        event_title = event.find('h2', class_='text-gray7 font-medium text-base pt-0 pb-1 line-clamp-3').text
        event_description = event.find('p', class_='hidden md:line-clamp-1 text-gray6').text
        event_location = event.find('p', class_='line-clamp-1 md:hidden').text
        event_images = event.find('img')['srcset']
        event_image = event.find('img')['src']
        event_link = event.find('a')['href']

        event_time = event_time.strip()
        event_title = event_title.strip()
        event_description = event_description.strip()
        event_location = event_location.strip()

        data.append({
            'time': event_time,
            'title': event_title,
            'location': event_location,
            'description': event_description,
            'images': event_images,
            'image': event_image,
            'link': event_link
        })

    print(data.__len__())
    with open(f'data.json', 'w') as json_file:
        json.dump(data, json_file, indent=4)
