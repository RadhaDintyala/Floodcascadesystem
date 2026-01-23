import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, CheckCircle, X, Clock, Mail, MessageCircle, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * AlertPanel Component
 * Displays active government alerts and their delivery status
 */
export const AlertPanel = ({ riskZones }) => {
  const [alerts, setAlerts] = useState([]);
  const [expandedAlert, setExpandedAlert] = useState(null);

  useEffect(() => {
    // Generate alerts from critical risk zones
    const criticalZones = riskZones.filter(z => z.riskLevel === 'Critical' || z.riskLevel === 'High');
    
    const generatedAlerts = criticalZones.map((zone, idx) => ({
      id: `ALERT-${Date.now()}-${idx}`,
      zone: zone.subdivision,
      severity: zone.riskLevel,
      anomaly: zone.anomalyPercent,
      timestamp: new Date().toISOString(),
      status: 'SENT',
      recipients: [
        { name: 'NDMA', channel: 'EMAIL', status: 'DELIVERED' },
        { name: 'IMD', channel: 'WHATSAPP', status: 'DELIVERED' },
        { name: 'State Authority', channel: 'PHONE', status: 'QUEUED' }
      ]
    }));

    setAlerts(generatedAlerts);
  }, [riskZones]);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-red-100 rounded-lg">
          <Bell className="h-5 w-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Active Alerts</h3>
          <p className="text-xs text-slate-500">Government notifications sent</p>
        </div>
        <div className="ml-auto">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100">
            <span className="text-sm font-bold text-red-600">{alerts.length}</span>
          </span>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
          <p className="text-sm text-slate-500">No critical alerts at this time</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
              className="border border-red-200 rounded-lg p-4 cursor-pointer hover:bg-red-50 transition-colors"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <h4 className="font-semibold text-slate-900">{alert.zone}</h4>
                    <span className="ml-auto text-xs font-bold px-2 py-1 rounded bg-red-100 text-red-700">
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Anomaly: {alert.anomaly.toFixed(2)}% | Sent: {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedAlert === alert.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-red-200"
                >
                  <p className="text-sm font-semibold text-slate-700 mb-3">Delivery Status:</p>
                  <div className="space-y-2">
                    {alert.recipients.map((recipient, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        {recipient.channel === 'EMAIL' && <Mail className="h-4 w-4 text-blue-500" />}
                        {recipient.channel === 'WHATSAPP' && <MessageCircle className="h-4 w-4 text-green-500" />}
                        {recipient.channel === 'PHONE' && <Phone className="h-4 w-4 text-orange-500" />}
                        <span className="text-xs text-slate-700 flex-1">{recipient.name}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          recipient.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {recipient.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertPanel;
