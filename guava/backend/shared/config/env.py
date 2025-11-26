"""
Environment configuration loader for Django microservices.
Uses pydantic for type-safe configuration management.
"""
import os
from typing import Optional
from pydantic import BaseSettings, Field
from functools import lru_cache
from pathlib import Path

# Load .env file from project root
ENV_FILE = Path(__file__).parent.parent.parent.parent / ".env"


class DatabaseConfig(BaseSettings):
    """Database configuration for a service"""
    host: str = Field(..., env="DB_HOST")
    port: int = Field(5432, env="DB_PORT")
    name: str = Field(..., env="DB_NAME")
    user: str = Field(..., env="DB_USER")
    password: str = Field(..., env="DB_PASSWORD")
    
    @property
    def url(self) -> str:
        """Generate database URL"""
        return f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.name}"
    
    class Config:
        env_file = str(ENV_FILE)
        case_sensitive = False


class RabbitMQConfig(BaseSettings):
    """RabbitMQ configuration"""
    host: str = Field("localhost", env="RABBITMQ_HOST")
    port: int = Field(5672, env="RABBITMQ_PORT")
    user: str = Field("guest", env="RABBITMQ_USER")
    password: str = Field("guest", env="RABBITMQ_PASSWORD")
    vhost: str = Field("/", env="RABBITMQ_VHOST")
    
    @property
    def url(self) -> str:
        """Generate RabbitMQ URL"""
        return f"amqp://{self.user}:{self.password}@{self.host}:{self.port}/{self.vhost}"
    
    class Config:
        env_file = str(ENV_FILE)
        case_sensitive = False


class RedisConfig(BaseSettings):
    """Redis configuration"""
    host: str = Field("localhost", env="REDIS_HOST")
    port: int = Field(6379, env="REDIS_PORT")
    password: Optional[str] = Field(None, env="REDIS_PASSWORD")
    db: int = Field(0, env="REDIS_DB")
    
    @property
    def url(self) -> str:
        """Generate Redis URL"""
        auth = f":{self.password}@" if self.password else ""
        return f"redis://{auth}{self.host}:{self.port}/{self.db}"
    
    class Config:
        env_file = str(ENV_FILE)
        case_sensitive = False


class AppConfig(BaseSettings):
    """Application configuration"""
    app_name: str = Field("Guava E-Commerce", env="APP_NAME")
    app_env: str = Field("development", env="APP_ENV")
    app_debug: bool = Field(True, env="APP_DEBUG")
    api_gateway_url: str = Field("http://localhost:8000", env="API_GATEWAY_URL")
    api_version: str = Field("v1", env="API_VERSION")
    
    # Service ports
    products_service_port: int = Field(8001, env="PRODUCTS_SERVICE_PORT")
    catalog_service_port: int = Field(8002, env="CATALOG_SERVICE_PORT")
    cms_service_port: int = Field(8003, env="CMS_SERVICE_PORT")
    orders_service_port: int = Field(8004, env="ORDERS_SERVICE_PORT")
    inventory_service_port: int = Field(8005, env="INVENTORY_SERVICE_PORT")
    promotions_service_port: int = Field(8006, env="PROMOTIONS_SERVICE_PORT")
    reports_service_port: int = Field(8007, env="REPORTS_SERVICE_PORT")
    
    class Config:
        env_file = str(ENV_FILE)
        case_sensitive = False


@lru_cache()
def get_app_config() -> AppConfig:
    """Get cached application configuration"""
    return AppConfig()


@lru_cache()
def get_database_config(service_name: str) -> DatabaseConfig:
    """
    Get database config for specific service.
    
    Args:
        service_name: Service name (e.g., 'PRODUCTS', 'CATALOG')
    
    Returns:
        DatabaseConfig instance
    """
    prefix = service_name.upper()
    
    # Create a custom config class with prefixed environment variables
    class ServiceDatabaseConfig(BaseSettings):
        host: str = Field(..., env=f"{prefix}_DB_HOST")
        port: int = Field(5432, env=f"{prefix}_DB_PORT")
        name: str = Field(..., env=f"{prefix}_DB_NAME")
        user: str = Field(..., env=f"{prefix}_DB_USER")
        password: str = Field(..., env=f"{prefix}_DB_PASSWORD")
        
        @property
        def url(self) -> str:
            return f"postgresql://{self.user}:{self.password}@{self.host}:{self.port}/{self.name}"
        
        class Config:
            env_file = str(ENV_FILE)
            case_sensitive = False
    
    return ServiceDatabaseConfig()


@lru_cache()
def get_rabbitmq_config() -> RabbitMQConfig:
    """Get cached RabbitMQ configuration"""
    return RabbitMQConfig()


@lru_cache()
def get_redis_config() -> RedisConfig:
    """Get cached Redis configuration"""
    return RedisConfig()


