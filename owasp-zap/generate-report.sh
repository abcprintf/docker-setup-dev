#!/bin/bash

# Generate Report from Current ZAP Session
# Usage: ./generate-report.sh

API_KEY="secret_key_123"
BASE_URL="http://localhost:8080"
REPORT_DIR="./zap-wrk/reports"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

echo "=================================="
echo "OWASP ZAP Report Generator"
echo "=================================="
echo ""

mkdir -p "$REPORT_DIR"

# Get summary
echo "Fetching scan data..."
urls_count=$(curl -s "${BASE_URL}/JSON/core/view/numberOfUrls/?apikey=${API_KEY}" | grep -o '"numberOfUrls":"[^"]*"' | cut -d'"' -f4)
alerts_data=$(curl -s "${BASE_URL}/JSON/core/view/alerts/?apikey=${API_KEY}")

# Count alerts by risk
high_count=$(echo "$alerts_data" | grep -o '"risk":"High"' | wc -l | tr -d ' ')
medium_count=$(echo "$alerts_data" | grep -o '"risk":"Medium"' | wc -l | tr -d ' ')
low_count=$(echo "$alerts_data" | grep -o '"risk":"Low"' | wc -l | tr -d ' ')
info_count=$(echo "$alerts_data" | grep -o '"risk":"Informational"' | wc -l | tr -d ' ')
total_alerts=$(echo "$alerts_data" | grep -c '"risk"')

echo ""
echo "📊 Scan Summary:"
echo "  • URLs Found: $urls_count"
echo "  • Total Alerts: $total_alerts"
echo ""
echo "🔴 High Risk: $high_count"
echo "🟡 Medium Risk: $medium_count"
echo "🔵 Low Risk: $low_count"
echo "ℹ️  Informational: $info_count"
echo ""

# Generate HTML Report
echo "Generating HTML report..."
curl -s "${BASE_URL}/OTHER/core/other/htmlreport/?apikey=${API_KEY}" -o "${REPORT_DIR}/zap-report-${TIMESTAMP}.html"
html_size=$(ls -lh "${REPORT_DIR}/zap-report-${TIMESTAMP}.html" | awk '{print $5}')

# Generate JSON Report
echo "Generating JSON report..."
echo "$alerts_data" > "${REPORT_DIR}/zap-alerts-${TIMESTAMP}.json"
json_size=$(ls -lh "${REPORT_DIR}/zap-alerts-${TIMESTAMP}.json" | awk '{print $5}')

# Generate Markdown Summary
echo "Generating Markdown summary..."
cat > "${REPORT_DIR}/scan-summary-${TIMESTAMP}.md" << EOF
# OWASP ZAP Scan Report Summary

**Generated:** $(date)  
**URLs Found:** $urls_count  
**Total Alerts:** $total_alerts

## Risk Distribution

| Risk Level | Count |
|------------|-------|
| 🔴 High | $high_count |
| 🟡 Medium | $medium_count |
| 🔵 Low | $low_count |
| ℹ️ Informational | $info_count |

## Alert Details

### High Risk Issues
\`\`\`
$(echo "$alerts_data" | grep -A 5 '"risk":"High"' | grep '"alert"' | cut -d'"' -f4 | sort -u)
\`\`\`

### Medium Risk Issues
\`\`\`
$(echo "$alerts_data" | grep -A 5 '"risk":"Medium"' | grep '"alert"' | cut -d'"' -f4 | sort -u)
\`\`\`

### Low Risk Issues  
\`\`\`
$(echo "$alerts_data" | grep -A 5 '"risk":"Low"' | grep '"alert"' | cut -d'"' -f4 | sort -u)
\`\`\`

## Files Generated
- HTML Report: zap-report-${TIMESTAMP}.html ($html_size)
- JSON Alerts: zap-alerts-${TIMESTAMP}.json ($json_size)
- Markdown Summary: scan-summary-${TIMESTAMP}.md

## View Report
\`\`\`bash
open ${REPORT_DIR}/zap-report-${TIMESTAMP}.html
\`\`\`
EOF

md_size=$(ls -lh "${REPORT_DIR}/scan-summary-${TIMESTAMP}.md" | awk '{print $5}')

echo ""
echo "=================================="
echo "✓ Reports Generated Successfully!"
echo "=================================="
echo ""
echo "📁 Reports saved in: $REPORT_DIR/"
echo ""
echo "Files created:"
echo "  • HTML Report: zap-report-${TIMESTAMP}.html ($html_size)"
echo "  • JSON Alerts: zap-alerts-${TIMESTAMP}.json ($json_size)"
echo "  • Summary: scan-summary-${TIMESTAMP}.md ($md_size)"
echo ""
echo "📄 View HTML report:"
echo "  open $REPORT_DIR/zap-report-${TIMESTAMP}.html"
echo ""
