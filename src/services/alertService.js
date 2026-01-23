/**
 * Government Alert Service
 * Sends flood alerts to government officials and agencies
 * Supports: Email, SMS, WhatsApp, In-app notifications
 */

// Government officials and agencies contact database
const GOV_OFFICIALS = {
  national: [
    {
      id: 'ndma-01',
      name: 'National Disaster Management Authority',
      email: 'alerts@ndma.gov.in',
      phone: '+91-11-26701700',
      whatsapp: '+91-9876543210',
      role: 'National Coordinator',
      priority: 'critical'
    },
    {
      id: 'imd-01',
      name: 'India Meteorological Department',
      email: 'alerts@imd.gov.in',
      phone: '+91-22-25696000',
      whatsapp: '+91-9988776655',
      role: 'Weather Monitoring',
      priority: 'high'
    }
  ],
  regional: {
    'ASSAM': [
      {
        id: 'assam-01',
        name: 'Assam Disaster Management Authority',
        email: 'dma@assam.gov.in',
        phone: '+91-361-2237281',
        whatsapp: '+91-9876543211',
        role: 'State Coordinator',
        priority: 'critical'
      },
      {
        id: 'assam-police',
        name: 'Assam Police - Disaster Response',
        email: 'disaster@assampolice.gov.in',
        phone: '+91-361-2222222',
        whatsapp: '+91-9876543212',
        role: 'Emergency Response',
        priority: 'high'
      }
    ],
    'BIHAR': [
      {
        id: 'bihar-01',
        name: 'Bihar Disaster Management Authority',
        email: 'dma@bihar.gov.in',
        phone: '+91-612-2218000',
        whatsapp: '+91-9876543213',
        role: 'State Coordinator',
        priority: 'critical'
      }
    ],
    'ODISHA': [
      {
        id: 'odisha-01',
        name: 'Odisha Disaster Management Authority',
        email: 'dma@odia.gov.in',
        phone: '+91-674-2570123',
        whatsapp: '+91-9876543214',
        role: 'State Coordinator',
        priority: 'critical'
      }
    ]
  }
};

// Alert severity levels
const ALERT_LEVELS = {
  CRITICAL: {
    level: 4,
    color: '#ef4444',
    message: 'CRITICAL FLOOD ALERT',
    broadcast: 'all',
    escalation: true
  },
  HIGH: {
    level: 3,
    color: '#f59e0b',
    message: 'HIGH FLOOD ALERT',
    broadcast: 'state',
    escalation: false
  },
  MODERATE: {
    level: 2,
    color: '#eab308',
    message: 'MODERATE FLOOD ALERT',
    broadcast: 'district',
    escalation: false
  },
  LOW: {
    level: 1,
    color: '#3b82f6',
    message: 'LOW FLOOD ALERT - MONITORING',
    broadcast: 'internal',
    escalation: false
  }
};

// Alert storage (in-memory, can be replaced with database)
const alertLog = [];

/**
 * Generate alert message based on risk data
 */
function generateAlertMessage(riskZone) {
  const severity = riskZone.severity;
  const anomaly = riskZone.anomalyPercent;
  
  return {
    title: `FLOOD ALERT: ${riskZone.subdivision}`,
    severity: riskZone.riskLevel,
    message: `
⚠️ FLOOD RISK ALERT ⚠️

📍 Location: ${riskZone.subdivision}
🌧️ Rainfall Anomaly: ${anomaly > 0 ? '+' : ''}${anomaly.toFixed(2)}% (${riskZone.anomalyMM > 0 ? '+' : ''}${riskZone.anomalyMM.toFixed(1)}mm)
📊 Current: ${riskZone.actualRainfall}mm | Normal: ${riskZone.normalRainfall}mm
⚠️ Risk Level: ${riskZone.riskLevel}
📅 Date: ${new Date().toISOString()}

🚨 RECOMMENDATION:
${riskZone.riskLevel === 'Critical' ? '• Activate emergency response' : '• Increase monitoring'}
${riskZone.riskLevel === 'Critical' ? '• Deploy NDRF teams' : '• Alert local authorities'}
${riskZone.riskLevel === 'Critical' ? '• Prepare evacuation routes' : '• Prepare emergency supplies'}

Data Source: India Meteorological Department
System: NDMA Flood Risk Decision Support
    `,
    timestamp: new Date().toISOString(),
    affectedPopulation: '2.4M+',
    recommendedAction: riskZone.riskLevel === 'Critical' ? 'IMMEDIATE_ACTION' : 'MONITOR'
  };
}

/**
 * Get recipients based on risk zone and alert level
 */
function getRecipients(riskZone, alertLevel) {
  const recipients = [...GOV_OFFICIALS.national];
  
  // Add state-specific officials
  const state = riskZone.subdivision;
  if (GOV_OFFICIALS.regional[state]) {
    recipients.push(...GOV_OFFICIALS.regional[state]);
  }
  
  // Filter by priority based on alert level
  if (alertLevel.level >= 3) {
    return recipients.filter(r => r.priority !== 'low');
  }
  return recipients;
}

/**
 * Simulate sending alert via multiple channels
 */
function sendAlertViaChannels(message, recipients) {
  const sentLogs = [];
  
  recipients.forEach(recipient => {
    // Email
    if (recipient.email) {
      sentLogs.push({
        channel: 'EMAIL',
        recipient: recipient.name,
        email: recipient.email,
        status: 'SENT',
        timestamp: new Date().toISOString(),
        messagePreview: message.title
      });
      console.log(`📧 Email sent to ${recipient.name} (${recipient.email})`);
    }
    
    // SMS/WhatsApp
    if (recipient.whatsapp) {
      sentLogs.push({
        channel: 'WHATSAPP',
        recipient: recipient.name,
        phone: recipient.whatsapp,
        status: 'SENT',
        timestamp: new Date().toISOString(),
        messagePreview: message.title
      });
      console.log(`💬 WhatsApp message sent to ${recipient.name}`);
    }
    
    // Phone Call (for critical alerts)
    if (message.severity === 'Critical') {
      sentLogs.push({
        channel: 'PHONE_CALL',
        recipient: recipient.name,
        phone: recipient.phone,
        status: 'QUEUED',
        timestamp: new Date().toISOString(),
        messagePreview: 'Critical Flood Alert - Voice Call'
      });
      console.log(`☎️ Phone call queued to ${recipient.name}`);
    }
  });
  
  return sentLogs;
}

/**
 * Main alert trigger function - Called when critical flood detected
 */
export function triggerFloodAlert(riskZone) {
  console.log('\n🚨🚨🚨 FLOOD ALERT TRIGGERED 🚨🚨🚨\n');
  
  // Determine alert level
  const alertLevel = ALERT_LEVELS[riskZone.riskLevel] || ALERT_LEVELS.LOW;
  
  // Generate message
  const alertMessage = generateAlertMessage(riskZone);
  
  // Get recipients
  const recipients = getRecipients(riskZone, alertLevel);
  
  // Send alerts
  const sentLogs = sendAlertViaChannels(alertMessage, recipients);
  
  // Create alert record
  const alertRecord = {
    id: `ALERT-${Date.now()}`,
    timestamp: new Date().toISOString(),
    zone: riskZone.subdivision,
    severity: riskZone.riskLevel,
    message: alertMessage,
    recipientCount: recipients.length,
    sentLogs: sentLogs,
    status: 'ACTIVE'
  };
  
  // Store in log
  alertLog.push(alertRecord);
  
  console.log(`\n✅ Alert #${alertRecord.id} sent to ${recipients.length} recipients`);
  console.log(`📊 Channels used: ${sentLogs.map(l => l.channel).join(', ')}\n`);
  
  return alertRecord;
}

/**
 * Get all active alerts
 */
export function getActiveAlerts() {
  return alertLog.filter(a => a.status === 'ACTIVE');
}

/**
 * Get alert history
 */
export function getAlertHistory() {
  return alertLog;
}

/**
 * Clear/Archive alert
 */
export function closeAlert(alertId) {
  const alert = alertLog.find(a => a.id === alertId);
  if (alert) {
    alert.status = 'ARCHIVED';
    alert.closedAt = new Date().toISOString();
    console.log(`✅ Alert ${alertId} archived`);
  }
  return alert;
}

/**
 * Check and auto-trigger alerts based on risk zones
 */
export function checkAndTriggerAlerts(riskZones) {
  console.log('\n📊 Checking risk zones for alerts...\n');
  
  const triggeredAlerts = [];
  
  riskZones.forEach(zone => {
    // Trigger alerts for Critical and High risk zones
    if (zone.riskLevel === 'Critical' || zone.riskLevel === 'High') {
      const alert = triggerFloodAlert(zone);
      triggeredAlerts.push(alert);
    }
  });
  
  if (triggeredAlerts.length === 0) {
    console.log('✅ No critical alerts needed at this time\n');
  }
  
  return triggeredAlerts;
}

/**
 * Get alert statistics
 */
export function getAlertStats() {
  return {
    totalAlerts: alertLog.length,
    activeAlerts: alertLog.filter(a => a.status === 'ACTIVE').length,
    archivedAlerts: alertLog.filter(a => a.status === 'ARCHIVED').length,
    criticalAlerts: alertLog.filter(a => a.severity === 'Critical').length,
    highAlerts: alertLog.filter(a => a.severity === 'High').length,
    lastAlertTime: alertLog.length > 0 ? alertLog[alertLog.length - 1].timestamp : null
  };
}

export default {
  triggerFloodAlert,
  getActiveAlerts,
  getAlertHistory,
  closeAlert,
  checkAndTriggerAlerts,
  getAlertStats,
  GOV_OFFICIALS,
  ALERT_LEVELS
};
