from fastapi import APIRouter
from utils.weather_service import get_weather
from utils.aqi_service import get_aqi
from utils.traffic_service import get_traffic
import logging

router = APIRouter()
_LOG = logging.getLogger(__name__)

@router.post("/environment/data")
async def get_environmental_data(data: dict):
    """
    Fetch all environmental data for a location
    """
    lat = data.get('lat')
    lon = data.get('lng') or data.get('lon')
    
    if lat is None or lon is None:
        return {
            "error": "Missing lat/lon",
            "temperature": 25.0,
            "rainfall": 0.0,
            "aqi": 100,
            "traffic": 50,
            "weatherCondition": "Clear"
        }
    
    try:
        weather_data = get_weather(float(lat), float(lon))
        aqi_value = get_aqi(float(lat), float(lon))
        traffic_value = get_traffic(float(lat), float(lon))
        
        _LOG.info(f"Environmental data for {lat},{lon}: temp={weather_data['temperature']}, rain={weather_data['rainfall']}, aqi={aqi_value}, traffic={traffic_value}")
        
        weather_condition = "Clear"
        if weather_data['rainfall'] > 10:
            weather_condition = "Heavy Rain"
        elif weather_data['rainfall'] > 5:
            weather_condition = "Rain"
        elif weather_data['rainfall'] > 0:
            weather_condition = "Light Rain"
        elif weather_data['temperature'] > 38:
            weather_condition = "Extreme Heat"
        
        return {
            "temperature": weather_data['temperature'],
            "rainfall": weather_data['rainfall'],
            "aqi": aqi_value,
            "traffic": traffic_value,
            "weatherCondition": weather_condition,
            "lat": lat,
            "lon": lon
        }
    
    except Exception as e:
        _LOG.error(f"Error fetching environmental data: {e}")
        return {
            "error": str(e),
            "temperature": 25.0,
            "rainfall": 0.0,
            "aqi": 100,
            "traffic": 50,
            "weatherCondition": "Clear"
        }
