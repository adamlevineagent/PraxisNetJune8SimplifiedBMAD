-- CreateTable
CREATE TABLE "OnboardingConversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "communicationStyle" TEXT NOT NULL,
    "transcript" JSONB NOT NULL,
    "turnCount" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'IN_PROGRESS',
    "completedAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnboardingConversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingConversation_conversationId_key" ON "OnboardingConversation"("conversationId");

-- CreateIndex
CREATE UNIQUE INDEX "OnboardingConversation_userId_key" ON "OnboardingConversation"("userId");

-- CreateIndex
CREATE INDEX "OnboardingConversation_status_idx" ON "OnboardingConversation"("status");

-- AddForeignKey
ALTER TABLE "OnboardingConversation" ADD CONSTRAINT "OnboardingConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;