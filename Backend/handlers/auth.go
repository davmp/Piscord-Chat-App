package handlers

import (
	"context"
	"net/http"
	"time"

	"piscord-backend/config"
	"piscord-backend/models"
	"piscord-backend/services"
	"piscord-backend/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type AuthHandler struct {
	MongoService *services.MongoService
	Config       *config.Config
}

func NewAuthHandler(mongoService *services.MongoService, config *config.Config) *AuthHandler {
	return &AuthHandler{
		MongoService: mongoService,
		Config:       config,
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req models.UserRegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	usersCollection := h.MongoService.GetCollection("users")
	var existingUser models.User
	err := usersCollection.FindOne(context.Background(), bson.M{
		"$or": []bson.M{
			{"username": req.Username},
		},
	}).Decode(&existingUser)

	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists"})
		return
	} else if err != mongo.ErrNoDocuments {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := models.User{
		ID:        primitive.NewObjectID(),
		Username:  req.Username,
		Password:  hashedPassword,
		Picture:   req.Picture,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	_, err = usersCollection.InsertOne(context.Background(), user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user record"})
		return
	}

	token, err := utils.GenerateJWT(user.ID.Hex(), user.Username, h.Config.JWTSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "User created but login failed: " + err.Error()})
		return
	}

	userResponse := models.UserResponse{
		ID:       user.ID,
		Username: user.Username,
		Picture:  user.Picture,
		Bio:      user.Bio,
		IsOnline: true,
	}

	c.JSON(http.StatusCreated, gin.H{
		"token": token,
		"user":  userResponse,
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req models.AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	usersCollection := h.MongoService.GetCollection("users")
	var user models.User
	err := usersCollection.FindOne(context.Background(), bson.M{"username": req.Username}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	if !utils.CheckPasswordHash(req.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token, err := utils.GenerateJWT(user.ID.Hex(), user.Username, h.Config.JWTSecret)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	userResponse := models.UserResponse{
		ID:       user.ID,
		Username: user.Username,
		Picture:  user.Picture,
		Bio:      user.Bio,
		IsOnline: true,
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
		"user":  userResponse,
	})
}

func (h *AuthHandler) Profile(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	objID, err := primitive.ObjectIDFromHex(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	usersCollection := h.MongoService.GetCollection("users")
	var user models.User
	err = usersCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	userResponse := models.UserResponse{
		ID:       user.ID,
		Username: user.Username,
		Picture:  user.Picture,
		Bio:      user.Bio,
		IsOnline: true,
	}

	c.JSON(http.StatusOK, userResponse)
}
