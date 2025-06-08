# API Key Setup for Praxis Network MVP

## OpenRouter API Key

For development and testing, you'll need an OpenRouter API key.

### Getting Started

1. **For Testing**: A test API key has been provided to the development team separately. Contact the project owner for access.

2. **For Production**: Sign up at [OpenRouter.ai](https://openrouter.ai) to get your own API key.

### Configuration

Add the API key to your `.env` file:

```env
OPENROUTER_API_KEY=sk-or-v1-[your-key-here]
```

### Security Best Practices

- **NEVER** commit API keys to version control
- Use environment variables for all sensitive data
- Rotate keys regularly
- Use different keys for development, staging, and production
- Monitor usage to detect any anomalies

### Test Key Usage

The provided test key has the following limitations:
- Rate limited for development use
- Should only be used for MVP development
- Monitor usage to stay within limits

### Troubleshooting

If you encounter API errors:
1. Verify the key is correctly set in `.env`
2. Check you're using the correct model: `google/gemini-2.0-flash-exp`
3. Ensure you haven't exceeded rate limits
4. Contact the project owner if issues persist

## Email API Key

For email delivery, you'll need either:
- SendGrid API key
- AWS SES credentials

Follow similar security practices as above.

---

**Remember**: Keep all API keys secure and never share them publicly!