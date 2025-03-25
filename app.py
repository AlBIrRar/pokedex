from flask import Flask, render_template
import requests
import json

app = Flask(__name__)

def get_pokemon_data():
    # Fetch first 151 Pokémon
    response = requests.get('https://pokeapi.co/api/v2/pokemon?limit=151')
    pokemon_list = response.json()['results']
    
    # Get detailed data for each Pokémon
    pokemon_data = []
    for pokemon in pokemon_list:
        details = requests.get(pokemon['url']).json()
        pokemon_data.append({
            'id': details['id'],
            'name': details['name'],
            'image': details['sprites']['front_default'],
            'types': [type['type']['name'] for type in details['types']]
        })
    return pokemon_data

@app.route('/')
def index():
    pokemon_data = get_pokemon_data()
    return render_template('index.html', pokemon_list=pokemon_data)

if __name__ == '__main__':
    app.run(debug=True) 