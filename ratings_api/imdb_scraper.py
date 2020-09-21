#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
from datetime import datetime

def scrape_cast(ttid):
	cast_url = "https://www.imdb.com/title/{0}/fullcredits?ref_=tt_cl_sm#cast".format(ttid)
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
		a2 = td.find_all('a', {"class": "toggle-episodes"})[0]
		nmid = a2.attrs['onclick'].replace('\'','').split(',')[1]
		cast_dict[nmid]['num_eps'] = a2.attrs['data-n']
		cast_dict[nmid]['on_click'] = a2.attrs['onclick']
		cast_dict[nmid]['episodes'] = []

		if len(a) > 0: #basically checks to see if there's an imdb page for the specific character
			a = a[0]
			character = a.contents[0].strip()
			# nmid = a.attrs['href'].split('characters/')[1]
			cast_dict[nmid]['character'] = character
		else:
			character = td.text.split('<a')[0].strip().replace('\t','').replace('\n','')
			cast_dict[nmid]['character'] = character

	for actor in cast_dict:
		click_list = cast_dict[actor]['on_click'].replace('\'','').split(',')
		nm = click_list[1]
		tt = click_list[2]
		category = click_list[3]
		ref = click_list[4]
		episodes_url = """
			https://www.imdb.com/name/{0}
			/episodes/_ajax?title={1}
			&category={2}
			&ref_marker={3}&start_index=0
			""".format(nm, tt, category, ref).replace('\t','').replace('\n','')
		episodes_doc = requests.get(episodes_url, allow_redirects=True).content
		soup = BeautifulSoup(episodes_doc, 'html.parser')
		eps = soup.find_all("div", {"class": "filmo-episodes"})
		if len(eps) <= 1:
			continue
		for ep in eps:
			anchor = ep.find_all('a', href=lambda x: x and '/title/tt' in x)[0]
			outside_text = anchor.next_sibling
			text_list = outside_text.split('...')
			if len(text_list) <= 1:
				continue
			ep_ttid = anchor.attrs['href'].split("/")[2]
			ep_name = anchor.text
			ep_year = text_list[0].strip().replace('\t','').replace('\n','').replace(')','').replace('(','')
			ep_character = text_list[1].strip().replace('\t','').replace('\n','')

			if "(credit only)" not in ep_character:
				cast_dict[actor]['episodes'].append({
					"ttid": ep_ttid,
					"name": ep_name,
					"year": ep_year,
					"character": ep_character
					})

	return cast_dict
