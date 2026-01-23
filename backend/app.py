"""
Flood Cascade System - Python Backend
Real-time rainfall data processing and API endpoints
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import csv
import logging
from datetime import datetime
from pathlib import Path

# Suppress Flask startup messages
logging.getLogger('werkzeug').setLevel(logging.ERROR)
os.environ['FLASK_ENV'] = 'production'

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
CORS(app)

# Paths
BASE_DIR = Path(__file__).parent.parent
DATA_DIR = BASE_DIR / 'src' / 'data'
HISTORICAL_CSV = DATA_DIR / 'rainfall in india 1901-2015.csv'
NORMALS_CSV = DATA_DIR / 'district wise rainfall normal.csv'
PROCESSED_DATA = DATA_DIR / 'processedData.json'


class RainfallDataProcessor:
    """Process rainfall datasets and generate risk analysis"""
    
    def __init__(self):
        self.historical_data = []
        self.normal_data = {}
        self.processed_data = None
        self.load_data()
    
    def load_data(self):
        """Load CSV files"""
        try:
            # Load historical data
            if HISTORICAL_CSV.exists():
                with open(HISTORICAL_CSV, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    self.historical_data = list(reader)
            
            # Load district normals
            if NORMALS_CSV.exists():
                with open(NORMALS_CSV, 'r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        self.normal_data[row.get('DISTRICT', '')] = row
            
            # Load processed data if exists
            if PROCESSED_DATA.exists():
                with open(PROCESSED_DATA, 'r') as f:
                    self.processed_data = json.load(f)
        except Exception as e:
            pass
    
    def get_current_risk_zones(self):
        """Get current risk zones from processed data"""
        if self.processed_data:
            return {
                "zones": self.processed_data.get('criticalZones', []),
                "timestamp": datetime.now().isoformat()
            }
        return {"zones": [], "timestamp": datetime.now().isoformat()}
    
    def get_risk_analysis(self):
        """Get detailed risk analysis"""
        if self.processed_data:
            return {
                "analysis": self.processed_data.get('riskAnalysis', []),
                "metadata": self.processed_data.get('metadata', {}),
                "timestamp": datetime.now().isoformat()
            }
        return {"analysis": [], "metadata": {}, "timestamp": datetime.now().isoformat()}
    
    def get_impact_data(self):
        """Get impact metrics"""
        if self.processed_data:
            return {
                "impacts": self.processed_data.get('impactData', {}),
                "timestamp": datetime.now().isoformat()
            }
        return {"impacts": {}, "timestamp": datetime.now().isoformat()}
    
    def get_alerts(self):
        """Generate alerts based on risk zones"""
        alerts = []
        if self.processed_data:
            for zone in self.processed_data.get('riskAnalysis', []):
                if zone.get('riskLevel') in ['Critical', 'High']:
                    alerts.append({
                        "id": zone.get('subdivision', '').lower().replace(' ', '_'),
                        "region": zone.get('subdivision'),
                        "severity": zone.get('anomalyPercent', 0),
                        "riskLevel": zone.get('riskLevel'),
                        "message": f"{zone.get('subdivision')}: {zone.get('riskLevel')} rainfall anomaly ({zone.get('anomalyPercent')}%)",
                        "timestamp": datetime.now().isoformat(),
                        "channels": ["Email", "WhatsApp", "SMS", "Phone"]
                    })
        return {"alerts": alerts, "count": len(alerts)}
    
    def get_district_data(self, district=None):
        """Get data for specific district"""
        if district and district in self.normal_data:
            return {
                "district": district,
                "normalData": self.normal_data[district],
                "timestamp": datetime.now().isoformat()
            }
        return None
    
    def get_statistics(self):
        """Get overall statistics"""
        return {
            "totalHistoricalRecords": len(self.historical_data),
            "totalDistricts": len(self.normal_data),
            "dataSource": "India Meteorological Department",
            "historicalPeriod": "1901-2015",
            "lastUpdated": datetime.now().isoformat(),
            "metadata": self.processed_data.get('metadata', {}) if self.processed_data else {}
        }


# Initialize processor
processor = RainfallDataProcessor()


# ==================== API ENDPOINTS ====================

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "running",
        "message": "Flood Cascade System Backend",
        "timestamp": datetime.now().isoformat()
    })


@app.route('/api/risk-zones', methods=['GET'])
def get_risk_zones():
    """Get current risk zones"""
    return jsonify(processor.get_current_risk_zones())


@app.route('/api/risk-analysis', methods=['GET'])
def get_risk_analysis():
    """Get detailed risk analysis"""
    return jsonify(processor.get_risk_analysis())


@app.route('/api/impact-data', methods=['GET'])
def get_impact_data():
    """Get impact metrics"""
    return jsonify(processor.get_impact_data())


@app.route('/api/alerts', methods=['GET'])
def get_alerts():
    """Get active alerts"""
    return jsonify(processor.get_alerts())


@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    """Get system statistics"""
    return jsonify(processor.get_statistics())


@app.route('/api/district/<district_name>', methods=['GET'])
def get_district(district_name):
    """Get data for specific district"""
    data = processor.get_district_data(district_name.upper())
    if data:
        return jsonify(data)
    return jsonify({"error": f"District {district_name} not found"}), 404


@app.route('/api/rainfall-data', methods=['GET'])
def get_rainfall_data():
    """Get all processed rainfall data (dashboard integration)"""
    return jsonify({
        "criticalZones": processor.processed_data.get('criticalZones', []) if processor.processed_data else [],
        "riskAnalysis": processor.processed_data.get('riskAnalysis', []) if processor.processed_data else [],
        "impactData": processor.processed_data.get('impactData', {}) if processor.processed_data else {},
        "metadata": processor.processed_data.get('metadata', {}) if processor.processed_data else {},
        "alerts": processor.get_alerts()["alerts"],
        "timestamp": datetime.now().isoformat()
    })


@app.route('/api/search', methods=['POST'])
def search():
    """Search endpoint for filtered data"""
    try:
        params = request.json or {}
        risk_level = params.get('riskLevel')
        subdivision = params.get('subdivision')
        
        results = []
        if processor.processed_data:
            for zone in processor.processed_data.get('riskAnalysis', []):
                if risk_level and zone.get('riskLevel') != risk_level:
                    continue
                if subdivision and subdivision.lower() not in zone.get('subdivision', '').lower():
                    continue
                results.append(zone)
        
        return jsonify({
            "results": results,
            "count": len(results),
            "query": params,
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route('/api/refresh', methods=['POST'])
def refresh_data():
    """Manually refresh data from CSV files"""
    try:
        processor.load_data()
        return jsonify({
            "status": "success",
            "message": "Data refreshed successfully",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    print("\n🚀 Flood Cascade Backend Running | http://localhost:5000\n")
    
    # Run on all interfaces, port 5000
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)
