"""Insert a BIS-attribute stripping inline script in src/app/layout.js.

The BIS browser extension injects `bis_skin_checked="1"` etc. on DOM
nodes after React renders. We strip them in a tiny inline <head> script
that runs while the document is parsed, so React never sees mismatched
attributes and no hydration-mismatch warning fires.
"""
import sys

path = r'D:\PROJECT-SEGALA-PROJECT\NzRouter\src\app\layout.js'
data = open(path, 'rb').read()

# Anchor: the</head> right after the fonts-loaded inline script.
anchor = b'     </head>\r\n'
if anchor not in data:
    print('Anchor</head> not found')
    sys.exit(1)

bis_script = (
    b'        {/* Strip BIS (browser extension) injected attributes before React hydrates.\r\n'
    b'            The BIS extension adds bis_skin_checked/bis_id/bis_use/etc. during the\r\n'
    b'            initial paint; without this every dashboard page emits a hydration\r\n'
    b'            mismatch warning. We remove them here and watch for late injections. */}\r\n'
    b'        <script\r\n'
    b'          dangerouslySetInnerHTML={{\r\n'
    b"            __html: `(function(){var a=['bis_skin_checked','bis_id','bis_use','bis_name','bis_comply','bis_size'];function s(n){if(!n||!n.hasAttribute)return;for(var i=0;i<a.length;i++)if(n.hasAttribute(a[i]))n.removeAttribute(a[i])}function w(n){var c=n&&n.children;if(!c)return;for(var i=0;i<c.length;i++)w(c[i]);s(c[i])}try{s(document.documentElement);w(document);var o=new MutationObserver(function(rs){for(var i=0;i<rs.length;i++){var r=rs[i];if(r.type==='attributes'){s(r.target)}else if(r.type==='childList'){for(var j=0;j<r.addedNodes.length;j++){var n=r.addedNodes[j];if(n.nodeType===1){s(n);w(n)}}}}});o.observe(document,{childList:true,subtree:true,attributes:true,attributeFilter:a})}catch(e){}})();`,\r\n"
    b'          }}\r\n'
    b'        />\r\n'
)

new_data = data.replace(anchor, bis_script + anchor, 1)

if new_data == data:
    print('No change applied')
    sys.exit(2)

open(path, 'wb').write(new_data)
print('Patched OK, file size:', len(new_data))
