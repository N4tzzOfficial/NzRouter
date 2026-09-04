"""Remove the loading-spinner gate from src/app/login/page.js so the form
renders immediately and the user does not stare at a spinner for 1-2s."""
import sys

path = r'D:\PROJECT-SEGALA-PROJECT\NzRouter\src\app\login\page.js'
data = open(path, 'rb').read()

# Construct by reading the actual surrounding bytes from the file.
start_marker = b'  // Show loading state while checking password\r\n'
end_marker = b'  return (\r\n    <div className="min-h-screen flex items-center justify-center bg-bg p-4 relative'

start_idx = data.find(start_marker)
end_idx = data.find(end_marker, start_idx)
if start_idx < 0 or end_idx < 0:
    print('Could not find markers. start:', start_idx, 'end:', end_idx)
    sys.exit(1)

old_block = data[start_idx:end_idx + len(b'  return (\r\n')]
print('Old block size:', len(old_block))
print('Old block repr:', repr(old_block))

new_block = (
    b'  // Render the form immediately. The /api/auth/status fetch in useEffect runs in the\r\n'
    b'  // background and only updates SSO/mode flags - it no longer gates the form itself,\r\n'
    b'  // so the user can type their password right away instead of staring at a spinner.\r\n'
    b'\r\n'
    b'  return (\r\n'
)

if old_block not in data:
    print('Old block not in data')
    sys.exit(2)
new_data = data.replace(old_block, new_block)
open(path, 'wb').write(new_data)
print('Patched OK, size:', len(new_data))
