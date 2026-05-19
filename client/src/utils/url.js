/**
 * Helper to dynamically determine the seller portal url based on whether the app is running
 * locally on localhost/127.0.0.1 or on a hosted production environment.
 * 
 * @param {string} path - The subpath, e.g. '/login' or '/register'
 * @returns {string} - The complete resolved URL
 */
export function getSellerPortalUrl(path = '') {
  const hostname = window.location.hostname
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
  
  if (isLocalhost) {
    // If the client runs on 5173, the seller runs on 5174. If client runs on 5174, seller runs on 5173.
    const port = window.location.port
    const targetPort = port === '5173' ? '5174' : '5173'
    return `${window.location.protocol}//${window.location.hostname}:${targetPort}${path}`
  }
  
  // Production hosted seller portal URL
  return `https://leather-craft-seller.onrender.com${path}`
}
