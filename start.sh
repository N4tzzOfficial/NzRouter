docker stop nzrouter
docker rm nzrouter
docker build -t nzrouter .
docker run -d --name nzrouter -p 20128:20128 --env-file .env -v nzrouter-data:/app/data nzrouter