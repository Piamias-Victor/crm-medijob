output "aws_region" {
  value = var.aws_region
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "rds_endpoint" {
  value = aws_db_instance.main.address
}

output "documents_bucket" {
  value = aws_s3_bucket.documents.bucket
}

output "database_url" {
  description = "Prisma DATABASE_URL (sensitive)"
  sensitive   = true
  value = format(
    "postgresql://%s:%s@%s:5432/%s?schema=public&sslmode=require",
    var.db_username,
    urlencode(random_password.db.result),
    aws_db_instance.main.address,
    var.db_name,
  )
}

output "vercel_aws_access_key_id" {
  description = "IAM access key id for Vercel → S3"
  value       = aws_iam_access_key.vercel.id
}

output "vercel_aws_secret_access_key" {
  description = "IAM secret for Vercel → S3 (sensitive)"
  sensitive   = true
  value       = aws_iam_access_key.vercel.secret
}
