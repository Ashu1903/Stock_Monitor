#!/bin/bash

set -e

until python manage.py migrate; do
  >&2 echo "Waiting for the database to be ready..."
  sleep 3
done

# Create migrations and apply them
echo "Creating database migrations..."
python manage.py makemigrations

echo "Applying database migrations..."
python manage.py migrate

#Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start Gunicorn processes
echo "Starting Gunicorn..."
gunicorn stockmonitor.wsgi:application --bind 0.0.0.0:8000 --workers 3 &

# Keep the container running
tail -f /dev/null