from flask import Flask, render_template, jsonify, send_from_directory, request
import sqlite3
import requests

from datetime import datetime

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('map.html')


@app.route('/photos/<path:filename>')
def get_photo(filename):
    return send_from_directory('photos', filename)
"""
def get_city_from_coordinates():
    url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat=31.736863&lon=35.181199"
    try:
        response = requests.get(url)

        # Check if the response is valid
        if response.status_code == 200:
            data = response.json()
            address = data.get('address', {})
            #full_city_name = address.get('city', address.get('town', address.get('village', '')))
            #Splitting the city name and selecting the Hebrew part
            #city_parts = full_city_name.split('|')
            #city = city_parts[0].strip() if city_parts else full_city_name
            #return city
            return address
        else:
            print(f"Error: Received status code {response.status_code}")
            return None
    except requests.RequestException as e:
        print(f"Error during geocoding: {e}")
        return None
"""

@app.route('/geolocation_data_with_photos')
def get_geolocation_data_with_photos():
    conn = sqlite3.connect('database4.db')
    cursor = conn.cursor()

    # Fetching query parameters for filtering
    event_number = request.args.get('eventNumber')
    photo_classification = request.args.get('classifications')
    start_range = request.args.get('startDateTime')
    end_range = request.args.get('endDateTime')
    all_times = request.args.get('allTimes') == 'true'
    street = request.args.get('street')
    city = request.args.get('city')
    submitted_by = request.args.get('name')
    # Base query to fetch all data
    query = """
        SELECT d.geolocation, d.photos, d.id, d.datetime, u.name, d.classification, d.city, d.street
        FROM data d
        JOIN users u ON d.submitted_by = u.uuid
    """
    parameters = []

    # Add conditions only if parameters are provided
    query_conditions = []
    photo_class_conditions = []
    if photo_classification:
        if photo_classification:
            photo_class_conditions = ["d.classification LIKE ?" for _ in photo_classification.split(',')]
            parameters.extend(['%' + classification + '%' for classification in photo_classification.split(',')])

    if photo_class_conditions:
        photo_class_group = '(' + ' OR '.join(photo_class_conditions) + ')'
        query_conditions.append(photo_class_group)

    if event_number:
        query_conditions.append('d.id = ?')
        parameters.append(event_number)

    if not all_times:
        if start_range:
            query_conditions.append('d.datetime >= ?')
            parameters.append(start_range)
        if end_range:
            query_conditions.append('d.datetime <= ?')
            parameters.append(end_range)

    if street:
        query_conditions.append('d.street = ?')
        parameters.append(street)

    if city:
        query_conditions.append('d.city = ?')
        parameters.append(city)

    if submitted_by:
        query_conditions.append('u.name = ?')
        parameters.append(submitted_by)
    # Append conditions to the base query
    if query_conditions:
        query += ' WHERE ' + ' AND '.join(query_conditions)

    cursor.execute(query, parameters)
    data = cursor.fetchall()


    formatted_data = []
    if not data:
        formatted_data.append({'message': 'No details found'})
    else:
        for row in data:
            lat_lng = row[0].split(',')
            photos = row[1].split(',')
            processed_photos = [photo.strip() for photo in photos]
            processed_photos1 = [ph.replace("\\", "/") for ph in processed_photos]
            event_id, user_name, classification = row[2], row[4], row[5]
            city = row[6]
            street = row[7]

            formatted_data.append({
                'lat': float(lat_lng[0].strip()),
                'lng': float(lat_lng[1].strip()),
                'photos': processed_photos1,
                'id': event_id,
                'start_range': start_range,
                'end_range': end_range,
                'submitted_by': user_name,
                'classification': classification,
                'city': city,
                'street': street
            })
    conn.close()

    return jsonify(formatted_data)

@app.route('/get_user_names')
def get_user_names():
    query = request.args.get('query')
    conn = sqlite3.connect('database4.db')
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM users WHERE name LIKE ?", (f'%{query}%',))  # Note the '%' signs around the query
    names = [row[0] for row in cursor.fetchall()]
    conn.close()
    return jsonify(names)

@app.route('/get_street')
def autocomplete_street():
    query = request.args.get('query')
    conn = sqlite3.connect('database4.db')
    cursor = conn.cursor()
    cursor.execute("SELECT street FROM data WHERE street LIKE ?", (f'%{query}%',))
    streets = [row[0] for row in cursor.fetchall()]
    conn.close()
    return jsonify(streets)

@app.route('/get_city')
def autocomplete_cities():
    query = request.args.get('query')
    conn = sqlite3.connect('database4.db')
    cursor = conn.cursor()
    cursor.execute("SELECT city FROM data WHERE city LIKE ?", (f'%{query}%',))
    cities = [row[0] for row in cursor.fetchall()]
    conn.close()
    return jsonify(cities)

if __name__ == '__main__':
    #print(get_city_from_coordinates())
    app.run(debug=True)
