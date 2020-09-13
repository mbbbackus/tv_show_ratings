#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup

cast_url = "https://www.imdb.com/title/tt0903747/fullcredits?ref_=tt_cl_sm#cast"
r = requests.get(cast_url, allow_redirects=True).content

print(BeautifulSoup(r, 'html.parser').prettify())