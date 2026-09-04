"""Fix indentation on the BIS-stripper block in src/app/layout.js so it
matches the rest of the file (the patch script left a single extra space)."""
import sys

path = r'D:\PROJECT-SEGALA-PROJECT\NzRouter\src\app\layout.js'
data = open(path, 'rb').read()

# The patch inserted an extra leading space on lines 40-49.
old = (
    b'         {/* Strip BIS (browser extension) injected attributes before React hydrates.\r\n'
    b'            The BIS extension adds bis_skin_checked/bis_id/bis_use/etc. during the\r\n'
    b'            initial paint; without this every dashboard page emits a hydration\r\n'
    b'            mismatch warning. We remove them here and watch for late injections. */}\r\n'
    b'        <script\r\n'
    b'          dangerouslySetInnerHTML={{\r\n'
)
new = (
    b'        {/* Strip BIS (browser extension) injected attributes before React hydrates.\r\n'
    b'            The BIS extension adds bis_skin_checked/bis_id/bis_use/etc. during the\r\n'
    b'            initial paint; without this every dashboard page emits a hydration\r\n'
    b'            mismatch warning. We remove them here and watch for late injections. */}\r\n'
    b'        <script\r\n'
    b'          dangerouslySetInnerHTML={{\r\n'
)

count = data.count(old)
print('Match count:', count)
if count != 1:
    print('Expected exactly 1 match')
    sys.exit(1)
new_data = data.replace(old, new)
open(path, 'wb').write(new_data)
print('Reindented, size:', len(new_data))
