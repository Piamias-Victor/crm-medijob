# Amplify Hosting app (connect GitHub in console if repository empty).
# SSR Next.js → platform WEB_COMPUTE.

data "aws_iam_policy_document" "amplify_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["amplify.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "amplify" {
  name               = "${var.project_name}-${var.environment}-amplify"
  assume_role_policy = data.aws_iam_policy_document.amplify_assume.json
}

data "aws_iam_policy_document" "amplify_s3" {
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

resource "aws_iam_role_policy" "amplify_s3" {
  name   = "documents-s3"
  role   = aws_iam_role.amplify.id
  policy = data.aws_iam_policy_document.amplify_s3.json
}

resource "aws_iam_role_policy_attachment" "amplify_backend" {
  role       = aws_iam_role.amplify.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess-Amplify"
}

resource "aws_amplify_app" "web" {
  name                 = "${var.project_name}-${var.environment}"
  platform             = "WEB_COMPUTE"
  iam_service_role_arn = aws_iam_role.amplify.arn

  build_spec = file("${path.module}/../amplify.yml")

  environment_variables = {
    AMPLIFY_MONOREPO_APP_ROOT = "apps/web"
    CRON_ENABLED              = "false"
    S3_DOCUMENTS_REGION       = var.aws_region
    S3_DOCUMENTS_BUCKET       = aws_s3_bucket.documents.bucket
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-amplify"
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.web.id
  branch_name = var.amplify_branch_name
  stage       = "PRODUCTION"
  framework   = "Next.js - SSR"
  enable_auto_build = true
}
