"""Patch login page second wrapper too (loading state branch)."""
import sys

path = r'D:\PROJECT-SEGALA-PROJECT\NzRouter\src\app\login\page.js'
data = open(path, 'rb').read()

old = b'    <div className="min-h-screen flex items-center justify-center bg-bg p-4 relative overflow-hidden">\r\n'
new = b'    <div className="min-h-screen flex items-center justify-center bg-bg p-4 relative overflow-hidden" suppressHydrationWarning>\r\n'

count = data.count(old)
print('Match count:', count)
if count:
    open(path, 'wb').write(data.replace(old, new))
    print('Patched')
else:
    print('Not found')
    sys.exit(1)
