#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup

cast_url = "https://www.imdb.com/title/tt0903747/fullcredits?ref_=tt_cl_sm#cast"
cast_doc = requests.get(cast_url, allow_redirects=True).content

soup = BeautifulSoup(cast_doc, 'html.parser')

soup = soup.find_all("table", {"class": "cast_list"})[0]
anchors = soup.find_all('a', href=lambda x: x and '/name/nm' in x)

cast_dict = {}
for a in anchors:
	if "<img" not in str(a.contents):
		nmid = a.attrs['href'].replace('/name/', '').replace('/','')
		if nmid not in cast_dict:
			cast_dict[nmid] = {}
			cast_dict[nmid]['actor'] = a.contents[0].strip()


tds = soup.find_all("td", {"class", "character"})
for td in tds:
	a = td.find_all('a', href=lambda x: x and '/title/tt' in x)

	if len(a) == 0:
		continue
	character = a[0].contents[0].strip()
	nmid = a[0].attrs['href'].split('characters/')[1]
	cast_dict[nmid]['character'] = character

	a = td.find_all('a', {"class": "toggle-episodes"})[0]
	cast_dict[nmid]['num_eps'] = a.attrs['data-n']
	cast_dict[nmid]['on_click'] = a.attrs['onclick']




print(cast_dict['nm0186505'])