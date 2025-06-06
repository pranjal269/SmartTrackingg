#!/bin/sh
set -e

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Apply the migrations manually
echo "Applying migrations manually..."
cd /src/WebApplication1
dotnet ef database update --no-build

# Start the application
echo "Starting the application..."
cd /app
exec dotnet WebApplication1.dll 