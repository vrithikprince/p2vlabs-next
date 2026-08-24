/**
 * Dial codes for the LeadCapture phone field.
 *
 * ISO code + name + dial code. No flag emoji on purpose: Windows ships no
 * flag glyphs, so emoji flags render there as a boxed two-letter fallback -
 * inconsistent across the exact audience this form is for. The ISO code
 * renders identically everywhere and reads cleaner against a monochrome form.
 *
 * `name` is what search matches on, alongside the ISO and dial code, so
 * "india", "in", "91" and "+91" all find the same row.
 */
export const COUNTRY_CODES = [
  { iso: 'IN', name: 'India',                dial: '+91'   },
  { iso: 'US', name: 'United States',        dial: '+1'    },
  { iso: 'GB', name: 'United Kingdom',       dial: '+44'   },
  { iso: 'AE', name: 'United Arab Emirates', dial: '+971'  },
  { iso: 'CA', name: 'Canada',               dial: '+1'    },
  { iso: 'AU', name: 'Australia',            dial: '+61'   },
  { iso: 'SG', name: 'Singapore',            dial: '+65'   },
  { iso: 'SA', name: 'Saudi Arabia',         dial: '+966'  },
  { iso: 'QA', name: 'Qatar',                dial: '+974'  },
  { iso: 'KW', name: 'Kuwait',               dial: '+965'  },
  { iso: 'OM', name: 'Oman',                 dial: '+968'  },
  { iso: 'BH', name: 'Bahrain',              dial: '+973'  },
  { iso: 'DE', name: 'Germany',              dial: '+49'   },
  { iso: 'FR', name: 'France',               dial: '+33'   },
  { iso: 'ES', name: 'Spain',                dial: '+34'   },
  { iso: 'IT', name: 'Italy',                dial: '+39'   },
  { iso: 'NL', name: 'Netherlands',          dial: '+31'   },
  { iso: 'BE', name: 'Belgium',              dial: '+32'   },
  { iso: 'CH', name: 'Switzerland',          dial: '+41'   },
  { iso: 'AT', name: 'Austria',              dial: '+43'   },
  { iso: 'SE', name: 'Sweden',               dial: '+46'   },
  { iso: 'NO', name: 'Norway',               dial: '+47'   },
  { iso: 'DK', name: 'Denmark',              dial: '+45'   },
  { iso: 'FI', name: 'Finland',              dial: '+358'  },
  { iso: 'IE', name: 'Ireland',              dial: '+353'  },
  { iso: 'PT', name: 'Portugal',             dial: '+351'  },
  { iso: 'PL', name: 'Poland',               dial: '+48'   },
  { iso: 'CZ', name: 'Czechia',              dial: '+420'  },
  { iso: 'GR', name: 'Greece',               dial: '+30'   },
  { iso: 'RO', name: 'Romania',              dial: '+40'   },
  { iso: 'HU', name: 'Hungary',              dial: '+36'   },
  { iso: 'TR', name: 'Turkey',               dial: '+90'   },
  { iso: 'RU', name: 'Russia',               dial: '+7'    },
  { iso: 'UA', name: 'Ukraine',              dial: '+380'  },
  { iso: 'IL', name: 'Israel',               dial: '+972'  },
  { iso: 'ZA', name: 'South Africa',         dial: '+27'   },
  { iso: 'NG', name: 'Nigeria',              dial: '+234'  },
  { iso: 'KE', name: 'Kenya',                dial: '+254'  },
  { iso: 'EG', name: 'Egypt',                dial: '+20'   },
  { iso: 'MA', name: 'Morocco',              dial: '+212'  },
  { iso: 'GH', name: 'Ghana',                dial: '+233'  },
  { iso: 'TZ', name: 'Tanzania',             dial: '+255'  },
  { iso: 'CN', name: 'China',                dial: '+86'   },
  { iso: 'JP', name: 'Japan',                dial: '+81'   },
  { iso: 'KR', name: 'South Korea',          dial: '+82'   },
  { iso: 'HK', name: 'Hong Kong',            dial: '+852'  },
  { iso: 'TW', name: 'Taiwan',               dial: '+886'  },
  { iso: 'MY', name: 'Malaysia',             dial: '+60'   },
  { iso: 'ID', name: 'Indonesia',            dial: '+62'   },
  { iso: 'TH', name: 'Thailand',             dial: '+66'   },
  { iso: 'VN', name: 'Vietnam',              dial: '+84'   },
  { iso: 'PH', name: 'Philippines',          dial: '+63'   },
  { iso: 'BD', name: 'Bangladesh',           dial: '+880'  },
  { iso: 'PK', name: 'Pakistan',             dial: '+92'   },
  { iso: 'LK', name: 'Sri Lanka',            dial: '+94'   },
  { iso: 'NP', name: 'Nepal',                dial: '+977'  },
  { iso: 'BT', name: 'Bhutan',               dial: '+975'  },
  { iso: 'MV', name: 'Maldives',             dial: '+960'  },
  { iso: 'NZ', name: 'New Zealand',          dial: '+64'   },
  { iso: 'BR', name: 'Brazil',               dial: '+55'   },
  { iso: 'MX', name: 'Mexico',               dial: '+52'   },
  { iso: 'AR', name: 'Argentina',            dial: '+54'   },
  { iso: 'CL', name: 'Chile',                dial: '+56'   },
  { iso: 'CO', name: 'Colombia',             dial: '+57'   },
  { iso: 'PE', name: 'Peru',                 dial: '+51'   },
]

export const DEFAULT_COUNTRY =
  COUNTRY_CODES.find((c) => c.iso === 'IN') || COUNTRY_CODES[0]

/** Matches on country name, ISO code, or dial code (with or without the +). */
export function filterCountries(query) {
  const q = query.trim().toLowerCase().replace(/^\+/, '')
  if (!q) return COUNTRY_CODES
  return COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.iso.toLowerCase().includes(q) ||
      c.dial.replace('+', '').startsWith(q),
  )
}
