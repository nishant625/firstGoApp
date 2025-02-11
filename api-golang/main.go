package main

import (
	"io/ioutil"
	"log"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"api-golang/database"
)

func init() {
	databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		content, err := ioutil.ReadFile(os.Getenv("DATABASE_URL_FILE"))
		if err != nil {
			log.Fatal(err)
		}
		databaseUrl = string(content)
	}

	errDB := database.InitDB(databaseUrl)
	if errDB != nil {
		log.Fatalf("⛔ Unable to connect to database: %v\n", errDB)
	} else {
		log.Println("DATABASE CONNECTED 🥇")
	}
}

func main() {
	r := gin.Default()

	// Add CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Allow requests from your React frontend
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	var tm time.Time

	r.GET("/", func(c *gin.Context) {
		tm = database.GetTime(c)
		c.JSON(200, gin.H{
			"api": "golang",
			"now": tm,
		})
	})

	r.GET("/ping", func(c *gin.Context) {
		tm = database.GetTime(c)
		c.JSON(200, "pong")
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (or "PORT" env var)
}
