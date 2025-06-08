# Praxis Network MVP - UX/UI Design Specifications

## Design Philosophy (Simplified)

The Praxis Network MVP focuses on proving the core concept with minimal UI complexity. The design prioritizes functionality over aesthetics, using standard components to deliver the 7 core features within the 12-week timeline.

## MVP Design Principles

1. **Functionality First**: Get the features working, polish later
2. **Standard Components**: Use shadcn/ui defaults, no custom styling
3. **Desktop Priority**: Optimize for desktop, basic mobile support

## Color Palette (Default)

Using shadcn/ui default theme:
- **Background**: White (#FFFFFF) / Light gray (#F9FAFB)
- **Text**: Black (#000000) / Dark gray (#374151)
- **Primary**: Blue (#3B82F6)
- **Success**: Green (#10B981)
- **Error**: Red (#EF4444)

No dark mode for MVP.

## Typography

- **Font**: System default (no custom fonts)
- **Sizes**: Browser defaults
- **Weights**: Normal and bold only

## Core UI Components (MVP Only)

### 1. Login/Register Forms
Simple forms with:
- Username input
- Password input
- Email input (register only)
- Submit button
- Error messages
- Link to switch between login/register

### 2. Agent Naming Form
Basic form with:
- Text input for agent name
- Submit button
- No personality options

### 3. Onboarding Chat
Simple chat interface:
- Message list (scrollable div)
- Text input at bottom
- Send button
- Basic message bubbles (left/right aligned)
- No typing indicators
- No timestamps

### 4. Admin Dashboard
Basic table with:
- List of pending users
- Username, email, date columns
- Approve button per row
- Simple pagination

### 5. Morning Report View
Read-only page showing:
- List of conversations
- Summary text
- "Request Introduction" buttons
- No fancy formatting

### 6. Proving Ground Overlay
When `?test-mode=true`:
- Fixed position overlay
- Status indicators (✅ ❌ ⚠️)
- Basic metrics display
- Semi-transparent background

## Simplified User Flows

### Registration Flow
1. **Register Page**: Username, password, email → Submit
2. **Redirect to Onboarding**: Automatic after registration

### Onboarding Flow
1. **Agent Naming**: Enter name → Submit
2. **Chat Interface**: Have conversation → Complete
3. **Pending Page**: "Awaiting approval" message

### Daily Use Flow
1. **Email Received**: Morning report at 8 AM
2. **Click Link**: Opens report in browser
3. **Request Introduction**: Click button → Confirmation

### Admin Flow
1. **Login**: Admin credentials
2. **Dashboard**: See pending users
3. **Approve**: Click approve → User activated

## Layout Structure

### Desktop Layout
```
+------------------+
|     Header       |
+------------------+
|                  |
|   Main Content   |
|                  |
+------------------+
```

### Mobile Layout
Same as desktop but narrower. No special mobile optimizations.

## Component Examples

### Login Form
```html
<div class="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow">
  <h1 class="text-2xl font-bold mb-4">Login</h1>
  <form>
    <input type="text" placeholder="Username" class="w-full p-2 border mb-4">
    <input type="password" placeholder="Password" class="w-full p-2 border mb-4">
    <button class="w-full bg-blue-500 text-white p-2 rounded">Login</button>
  </form>
  <p class="mt-4">New user? <a href="/register" class="text-blue-500">Register</a></p>
</div>
```

### Chat Message
```html
<!-- Agent message -->
<div class="flex justify-start mb-4">
  <div class="bg-gray-100 p-3 rounded max-w-xs">
    <p>Hello! I'm your Praxis agent. Tell me about your work.</p>
  </div>
</div>

<!-- User message -->
<div class="flex justify-end mb-4">
  <div class="bg-blue-100 p-3 rounded max-w-xs">
    <p>I'm a software developer working on AI projects.</p>
  </div>
</div>
```

### Admin Table Row
```html
<tr>
  <td class="p-2 border">john_doe</td>
  <td class="p-2 border">john@example.com</td>
  <td class="p-2 border">2025-06-08</td>
  <td class="p-2 border">
    <button class="bg-green-500 text-white px-4 py-1 rounded">Approve</button>
  </td>
</tr>
```

## Responsive Design (Basic)

- **Desktop**: Full width up to 1200px
- **Tablet**: Same as desktop
- **Mobile**: Stack elements vertically
- **No breakpoint-specific designs**

## Accessibility (Minimal)

- Basic semantic HTML
- Form labels
- Button hover states
- No ARIA attributes for MVP
- No keyboard navigation optimization

## No Animations

- No transitions
- No loading spinners (use text: "Loading...")
- No hover effects beyond color change
- Focus on functionality

## Implementation Notes

1. **Use shadcn/ui components as-is** - no customization
2. **Tailwind utility classes only** - no custom CSS
3. **Standard form validation** - browser defaults
4. **Simple error handling** - alert() or inline text
5. **No loading states** - except "Loading..." text
6. **No empty states** - show "No data" text

## Deferred UI Features (Post-MVP)

- Dark mode / Midnight Protocol theme
- Custom fonts and typography
- Animations and transitions
- Advanced responsive design
- Full accessibility compliance
- Empty states and illustrations
- Loading skeletons
- Toast notifications
- Modal dialogs
- Rich text editing
- Data visualizations

## Success Metrics

- All 7 features have working UI
- Forms submit successfully
- Chat interface allows conversation
- Admin can approve users
- Reports display correctly
- Introduction requests work

## Conclusion

This simplified UX/UI specification focuses on delivering functional interfaces for the MVP features. By using standard components and avoiding custom styling, we can build the UI quickly while maintaining a clean foundation for future enhancements. The goal is to prove the concept, not win design awards.
