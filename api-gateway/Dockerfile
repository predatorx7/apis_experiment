FROM golang:bullseye

WORKDIR /app

COPY . .

RUN go build -o api-gateway .

EXPOSE 8000

CMD ["./api-gateway"]
