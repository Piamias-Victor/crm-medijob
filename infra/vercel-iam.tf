# IAM user for Vercel → S3 documents (no Amplify role on Vercel).

data "aws_iam_policy_document" "vercel_s3" {
  statement {
    sid = "DocumentsBucket"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]
    resources = [
      aws_s3_bucket.documents.arn,
      "${aws_s3_bucket.documents.arn}/*",
    ]
  }
}

resource "aws_iam_user" "vercel" {
  name = "${var.project_name}-${var.environment}-vercel"
  tags = { Name = "${var.project_name}-${var.environment}-vercel" }
}

resource "aws_iam_user_policy" "vercel_s3" {
  name   = "documents-s3"
  user   = aws_iam_user.vercel.name
  policy = data.aws_iam_policy_document.vercel_s3.json
}

resource "aws_iam_access_key" "vercel" {
  user = aws_iam_user.vercel.name
}
