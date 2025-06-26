import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Clock, 
  Settings,
  Plus,
  Trash2,
  Eye,
  Calendar,
  Target,
  BellRing,
  Volume2,
  VolumeX,
  CheckCircle
} from 'lucide-react';
import Countdown from './components/Countdown';

const AlertSystem = () => {
  const [alerts, setAlerts] = useState([]);
  const [notifications, setNotifications] = useState({
    enabled: true,
    sound: true,
    email: false,
    browser: true,
    thresholds: {
      distance: 0.1, // AU
      size: 100, // meters
      timeframe: 30 // days
    }
  });
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate mock alert data
  const generateAlerts = () => {
    const mockAlerts = [
      {
        id: 'alert_1',
        asteroidName: '2024 BX1',
        type: 'close_approach',
        priority: 'high',
        message: 'Close approach within 10 lunar distances',
        targetDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        distance: { au: 0.026, ld: 10.1 },
        diameter: 280,
        velocity: 15.6,
        isActive: true,
        createdAt: new Date().toISOString(),
        notificationSent: false
      },
      {
        id: 'alert_2',
        asteroidName: 'Apophis',
        type: 'pho_update',
        priority: 'medium',
        message: 'Orbital parameters updated - trajectory refined',
        targetDate: new Date('2029-04-13').toISOString(),
        distance: { au: 0.00025, ld: 9.6 },
        diameter: 370,
        velocity: 7.42,
        isActive: true,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        notificationSent: true
      },
      {
        id: 'alert_3',
        asteroidName: '2023 DW3',
        type: 'discovery',
        priority: 'low',
        message: 'New potentially hazardous asteroid discovered',
        targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        distance: { au: 0.067, ld: 26.1 },
        diameter: 450,
        velocity: 12.3,
        isActive: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        notificationSent: true
      }
    ];

    return mockAlerts;
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockAlerts = generateAlerts();
      setAlerts(mockAlerts);
      setActiveAlerts(mockAlerts.filter(alert => alert.isActive));
      setLoading(false);
    }, 1000);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-300 bg-red-900/20 border-red-500/30';
      case 'medium': return 'text-yellow-300 bg-yellow-900/20 border-yellow-500/30';
      case 'low': return 'text-green-300 bg-green-900/20 border-green-500/30';
      default: return 'text-blue-300 bg-blue-900/20 border-blue-500/30';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'close_approach': return Target;
      case 'pho_update': return AlertTriangle;
      case 'discovery': return Eye;
      default: return Bell;
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, isActive: false }
          : alert
      )
    );
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const deleteAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    setActiveAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const toggleNotifications = () => {
    setNotifications(prev => ({
      ...prev,
      enabled: !prev.enabled
    }));
  };

  const updateNotificationSettings = (setting, value) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const AlertCard = ({ alert }) => {
    const IconComponent = getAlertIcon(alert.type);
    const priorityClass = getPriorityColor(alert.priority);

    return (
      <div className={`rounded-xl p-6 border backdrop-blur-lg ${priorityClass} transition-all duration-300 hover:scale-105`}>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${
              alert.priority === 'high' ? 'bg-red-600' :
              alert.priority === 'medium' ? 'bg-yellow-600' :
              'bg-green-600'
            }`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{alert.asteroidName}</h3>
              <p className="text-sm text-white/60 capitalize">{alert.type.replace('_', ' ')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              alert.priority === 'high' ? 'bg-red-500/20 text-red-300' :
              alert.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
              'bg-green-500/20 text-green-300'
            }`}>
              {alert.priority.toUpperCase()}
            </span>
            
            <button
              onClick={() => dismissAlert(alert.id)}
              className="p-1 text-white/60 hover:text-white transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => deleteAlert(alert.id)}
              className="p-1 text-white/60 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-white/80">{alert.message}</p>
        </div>

        {alert.type === 'close_approach' && (
          <div className="mb-4">
            <Countdown targetDate={alert.targetDate} />
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="bg-black/20 rounded-lg p-3">
            <div className="text-xs text-blue-300 mb-1">Distance</div>
            <div className="font-bold text-white">{alert.distance.ld} LD</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3">
            <div className="text-xs text-green-300 mb-1">Size</div>
            <div className="font-bold text-white">{alert.diameter}m</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3">
            <div className="text-xs text-yellow-300 mb-1">Velocity</div>
            <div className="font-bold text-white">{alert.velocity} km/s</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3">
            <div className="text-xs text-purple-300 mb-1">Created</div>
            <div className="font-bold text-white">
              {new Date(alert.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NotificationSettings = () => (
    <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-5 h-5 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Notification Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Global Toggle */}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-white font-medium">Enable Notifications</div>
            <div className="text-sm text-white/60">Receive alerts for asteroid events</div>
          </div>
          <button
            onClick={toggleNotifications}
            className={`p-2 rounded-lg transition-colors ${
              notifications.enabled 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-600 text-white/60'
            }`}
          >
            {notifications.enabled ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
          </button>
        </div>

        {notifications.enabled && (
          <>
            {/* Notification Types */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Notification Types</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/10">
                  <input
                    type="checkbox"
                    checked={notifications.sound}
                    onChange={(e) => updateNotificationSettings('sound', e.target.checked)}
                    className="rounded"
                  />
                  {notifications.sound ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
                  <span className="text-white">Sound Alerts</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/10">
                  <input
                    type="checkbox"
                    checked={notifications.browser}
                    onChange={(e) => updateNotificationSettings('browser', e.target.checked)}
                    className="rounded"
                  />
                  <Bell className="w-4 h-4 text-blue-400" />
                  <span className="text-white">Browser Notifications</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/10">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => updateNotificationSettings('email', e.target.checked)}
                    className="rounded"
                  />
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-white">Email Notifications</span>
                </label>
              </div>
            </div>

            {/* Alert Thresholds */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Alert Thresholds</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                  <label className="block text-sm text-white/70 mb-2">
                    Distance Threshold (AU)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={notifications.thresholds.distance}
                    onChange={(e) => updateNotificationSettings('thresholds', {
                      ...notifications.thresholds,
                      distance: parseFloat(e.target.value)
                    })}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                  <label className="block text-sm text-white/70 mb-2">
                    Minimum Size (meters)
                  </label>
                  <input
                    type="number"
                    value={notifications.thresholds.size}
                    onChange={(e) => updateNotificationSettings('thresholds', {
                      ...notifications.thresholds,
                      size: parseInt(e.target.value)
                    })}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div className="bg-black/20 rounded-lg p-4 border border-white/10">
                  <label className="block text-sm text-white/70 mb-2">
                    Time Window (days)
                  </label>
                  <input
                    type="number"
                    value={notifications.thresholds.timeframe}
                    onChange={(e) => updateNotificationSettings('thresholds', {
                      ...notifications.thresholds,
                      timeframe: parseInt(e.target.value)
                    })}
                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-white/70">
          <Bell className="w-6 h-6 animate-pulse" />
          <span>Loading alert system...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Alert Management</h3>
            <span className="text-sm text-white/60">({activeAlerts.length} active alerts)</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              notifications.enabled 
                ? 'bg-green-900/20 border border-green-500/30 text-green-300'
                : 'bg-gray-900/20 border border-gray-500/30 text-gray-300'
            }`}>
              {notifications.enabled ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
              <span className="text-sm">
                {notifications.enabled ? 'Notifications On' : 'Notifications Off'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Active Alerts
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {/* Notification Settings */}
      <NotificationSettings />

      {/* Alert History */}
      {alerts.filter(alert => !alert.isActive).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Alert History
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {alerts
              .filter(alert => !alert.isActive)
              .map(alert => (
                <div key={alert.id} className="opacity-60">
                  <AlertCard alert={alert} />
                </div>
              ))}
          </div>
        </div>
      )}

      {activeAlerts.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-300 mb-2">All Clear</h3>
          <p className="text-white/50">No active alerts at this time. Monitoring continues.</p>
        </div>
      )}
    </div>
  );
};

export default AlertSystem; 