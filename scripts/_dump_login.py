"""Inspect lines 141-160 of the login page to find the exact byte sequence."""
path = r'D:\PROJECT-SEGALA-PROJECT\NzRouter\src\app\login\page.js'
with open(path, 'rb') as f:
    data = f.read()
# Find the spinner block
idx = data.find(b'if (hasPassword === null)')
print('Index:', idx)
if idx >= 0:
    print('Around block:')
    print(repr(data[idx:idx+500]))
