# Real-time Data Integration - Quick Start Guide

## System Architecture

```
CSV Datasets (src/data/)
    ↓
Python Backend (Flask) on port 5000
    ↓
React Dashboard (Vite) on port 5174
    ↓
Real-time Visualization & Alerts
```

## Step 1: Start Python Backend

### Windows (Easy)

```powershell
cd backend
.\start.bat
```

### Windows (Manual)

```powershell
cd backend
pip install -r requirements.txt
python app.py
```

### Mac/Linux

```bash
cd backend
pip install -r requirements.txt
python app.py
```

✅ Watch for: `🚀 FLASK SERVER RUNNING ON http://0.0.0.0:5000`

## Step 2: Start React Frontend

In a **new terminal**:

```powershell
npm run dev
```

✅ Watch for: `✓ ready in X ms` and "Local: http://localhost:5174"

## Step 3: Verify Connection

The dashboard should show:

- **Status Badge**: "✅ Backend Connected" (top right)
- **Live Data**: Real zones from CSV analysis
- **Rainfall Anomalies**: Tamil Nadu (25.48%), Lakshadweep (2.68%), etc.
- **Alerts**: Government alerts for critical zones

## What's Happening

1. **Backend Processing**
   - Reads: rainfall in india 1901-2015.csv (4116 records)
   - Reads: district wise rainfall normal.csv (641 records)
   - Calculates: Anomalies and risk zones
   - Outputs: Real-time API endpoints

2. **Frontend Consumption**
   - Fetches `/api/rainfall-data` every 30 seconds
   - Fetches `/api/alerts` every 15 seconds
   - Displays real zones from backend
   - Shows government alert system

3. **Data Updates**
   - No need to regenerate processData.json
   - Backend reads CSVs directly
   - Changes appear on dashboard instantly

## Checking Backend Status

### API Health Check

```powershell
curl http://localhost:5000/api/health
```

### Get Risk Zones

```powershell
curl http://localhost:5000/api/risk-zones
```

### Get Alerts

```powershell
curl http://localhost:5000/api/alerts
```

## Data Endpoints

| Endpoint             | Purpose           | Interval  |
| -------------------- | ----------------- | --------- |
| `/api/rainfall-data` | Full dataset      | 30s       |
| `/api/alerts`        | Active alerts     | 15s       |
| `/api/risk-analysis` | Detailed analysis | 30s       |
| `/api/statistics`    | System stats      | On demand |

## Troubleshooting

### "Backend Disconnected" in Dashboard

- Check: Is Flask running on port 5000?
- Check: Any error messages in backend terminal?
- Solution: Restart backend with `python app.py`

### No Data Showing on Dashboard

- Check: CSV files exist in `src/data/`
- Check: Backend shows "✅ Loaded X records"
- Solution: Refresh browser (F5)

### "Port 5000 already in use"

```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill it (replace PID)
taskkill /PID <PID> /F
```

### Backend Crashes on Startup

```
ModuleNotFoundError: No module named 'flask'
```

Solution:

```powershell
cd backend
pip install -r requirements.txt
```

## Real-time Features

✅ **Live Zones**: Automatically updates every 30 seconds
✅ **Rainfall Anomalies**: Shows % above/below normal
✅ **Government Alerts**: Triggers for Critical/High risk zones
✅ **Impact Data**: Real infrastructure metrics
✅ **Risk Analysis**: Per-subdivision breakdown

## Data Sources

- **Historical**: India Meteorological Department (1901-2015)
- **Normals**: District-level baseline rainfall
- **Processing**: Automated anomaly calculation in backend
- **Updates**: Real-time without file regeneration

## Performance

- Backend startup: ~2-3 seconds
- Data processing: ~500ms
- API response time: <100ms
- Dashboard refresh: 30-second intervals

---

**That's it!** Your real-time flood cascade dashboard is now live with Python backend integration.
