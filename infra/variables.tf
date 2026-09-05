variable "aws_region" {
  type        = string
  description = "AWS region (Paris = eu-west-3)"
  default     = "eu-west-3"
}

variable "project_name" {
  type    = string
  default = "medijob"
}

variable "environment" {
  type    = string
  default = "prod"
}

variable "db_instance_class" {
  type        = string
  description = "RDS size — t4g.micro = free-tier friendly; t4g.small si compte payant"
  default     = "db.t4g.micro"
}

variable "db_name" {
  type    = string
  default = "medijob"
}

variable "db_username" {
  type    = string
  default = "medijob"
}

variable "allowed_cidr_blocks" {
  type        = list(string)
  description = "CIDR autorisés sur Postgres (ton IP publique /32). Ex: [\"1.2.3.4/32\"]"
}

variable "amplify_branch_name" {
  type        = string
  description = "Git branch déployée sur Amplify"
  default     = "dev"
}

variable "documents_bucket_force_destroy" {
  type        = bool
  description = "true seulement si tu acceptes de tout effacer au terraform destroy"
  default     = false
}
