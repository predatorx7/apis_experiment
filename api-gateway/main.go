package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
	"fmt"
	"github.com/gin-gonic/gin"
)

// Define a struct to hold the information about backend services
type backendService struct {
	URL        string
	PathPrefix string
	authRequired bool
}

// Define a struct to hold the information about the Auth Microservice
type authMicroservice struct {
	URL string
}

var authMicroserviceURL = "http://auth_service:8001" // Example Auth Microservice URL

// Define a slice to hold multiple backend services
var backendServices = []backendService{
	{
		URL:        "http://demo_service:8002", // Example backend service 1
		PathPrefix: "/demo",
		authRequired: true,
	},
	{
		URL:        "http://hello_service:8003", // Example backend service 2
		PathPrefix: "/hello",
		authRequired: true,
	},
	{
		URL:        authMicroserviceURL, // Example backend service 2
		PathPrefix: "/auth",
		authRequired: false,
	},
	{
		URL:        "http://nodejs_hello_api:8004", // Example backend service 2
		PathPrefix: "/",
		authRequired: true,
	},

}


func main() {
	// Create a new Gin router
	router := gin.Default()

	// Define a middleware to handle authentication and authorization
	router.Use(handleAuthMiddleware)

	// Define a handler for all incoming requests
	router.NoRoute(handleRequest)

	// Start the server
	log.Println("API Gateway is running on port 8000...")
	err := router.Run(":8000")
	if err != nil {
		log.Fatal(err)
	}
}

func handleAuthMiddleware(c *gin.Context) {
	// Check if it's an /auth/login request
	if c.Request.URL.Path == "/auth/login" {
		// Forward the request to the Auth Microservice
		// proxy := createReverseProxy(authMicroserviceURL)
		// proxy.ServeHTTP(c.Writer, c.Request)
		// c.Abort()
		c.Next()
		return
	}

	// Authenticate and authorize the user with the Auth Microservice
	if !authorizeUser(c) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Authorization failed"})
		c.Abort()
		return
	}

	// Continue to the next handler
	c.Next()
}

func handleRequest(c *gin.Context) {
	// Find the appropriate backend service for the requested URL
	backend := findBackendService(c.Request.URL.Path)

	if backend != nil {
		// Proxy the request to the backend service
		proxy := createReverseProxy(backend.URL)
		proxy.ServeHTTP(c.Writer, c.Request)
	} else {
		// No backend service found and the user is authenticated and authorized
		c.JSON(http.StatusNotFound, gin.H{"error": "Endpoint not found"})
	}
}

func findBackendService(path string) *backendService {
	for _, service := range backendServices {
		if path == service.PathPrefix || strings.HasPrefix(path, service.PathPrefix+"/") {
			return &service
		}
	}
	return nil
}

func createReverseProxy(targetURL string) *httputil.ReverseProxy {
	target, _ := url.Parse(targetURL)
	proxy := httputil.NewSingleHostReverseProxy(target)
	return proxy
}

func authorizeUser(c *gin.Context) bool {
	// Get the token from the Authorization header
	token := c.GetHeader("Authorization")
	if token == "" {
		fmt.Print("No auth token");
		return false
	}
	fmt.Print("token: ");
	fmt.Print(token);
	// Make a request to the Auth Microservice to authorize the token
	authURL := authMicroserviceURL + "/auth/authorize"
	req, _ := http.NewRequest(http.MethodGet, authURL, nil)
	req.Header.Set("Authorization", token)
	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil || resp.StatusCode != http.StatusOK {
		return false
	}

	return true
}
