run: stop build
	docker run -it -d -p 80:80 --name spce spce
stop: 
	docker stop spce || true && docker rm spce || true
build: 
	docker build -t spce .

